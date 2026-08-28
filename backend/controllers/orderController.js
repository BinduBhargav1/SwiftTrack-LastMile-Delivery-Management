const db = require('../db');
const { triggerAutoAssignForZone } = require('../utils/autoAssign');

exports.createOrder = async (req, res) => {
    try {
        const { 
            customer_id, pickup_address, drop_address, pickup_zone, drop_zone, 
            length, width, height, actual_weight, order_type, payment_type 
        } = req.body;

        if (!customer_id || !pickup_address || !drop_address || !pickup_zone || !drop_zone || !actual_weight || !order_type || !payment_type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Calculate volumetric and chargeable weight
        const l = parseFloat(length) || 0;
        const w = parseFloat(width) || 0;
        const h = parseFloat(height) || 0;
        const volumetric_weight = (l * w * h) / 5000;
        const chargeable_weight = Math.max(parseFloat(actual_weight), volumetric_weight);

        // Fetch rate card
        const [rates] = await db.query(
            'SELECT * FROM rate_cards WHERE from_zone = ? AND to_zone = ? AND order_type = ?',
            [pickup_zone, drop_zone, order_type]
        );

        if (rates.length === 0) {
            return res.status(400).json({ error: 'No rate card found for this route' });
        }

        const rate = rates[0];
        let delivery_charge = chargeable_weight * parseFloat(rate.rate_per_kg);
        if (payment_type === 'COD') {
            delivery_charge += parseFloat(rate.cod_surcharge);
        }

        // Generate tracking number
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM orders');
        const tracking_number = `LM1000${total + 1}`;

        // Insert Order
        const [result] = await db.query(
            `INSERT INTO orders (
                tracking_number, customer_id, pickup_address, drop_address, pickup_zone, drop_zone,
                length, width, height, actual_weight, volumetric_weight, chargeable_weight,
                order_type, payment_type, delivery_charge, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                tracking_number, customer_id, pickup_address, drop_address, pickup_zone, drop_zone,
                l, w, h, actual_weight, volumetric_weight, chargeable_weight,
                order_type, payment_type, delivery_charge, 'Order Placed'
            ]
        );

        const orderId = result.insertId;

        // Insert Initial Tracking History
        await db.query(
            'INSERT INTO tracking_history (order_id, status) VALUES (?, ?)',
            [orderId, 'Order Placed']
        );

        res.status(201).json({ 
            order_id: orderId, 
            tracking_number, 
            delivery_charge,
            chargeable_weight 
        });

        // Try auto assign asynchronously
        triggerAutoAssignForZone(pickup_zone);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const { customer_id, agent_id } = req.query;
        let query = `
            SELECT o.*, 
                   pz.zone_name as pickup_zone_name,
                   dz.zone_name as drop_zone_name,
                   u.name as agent_name,
                   u.phone as agent_phone
            FROM orders o
            LEFT JOIN zones pz ON o.pickup_zone = pz.zone_id
            LEFT JOIN zones dz ON o.drop_zone = dz.zone_id
            LEFT JOIN agents a ON o.agent_id = a.agent_id
            LEFT JOIN users u ON a.user_id = u.user_id
            WHERE 1=1
        `;
        let params = [];
        
        if (customer_id) {
            query += ' AND o.customer_id = ?';
            params.push(customer_id);
        } else if (agent_id) {
            query += ' AND o.agent_id = (SELECT agent_id FROM agents WHERE user_id = ?)';
            params.push(agent_id);
        }
        
        query += ' ORDER BY o.created_at DESC';
        const [orders] = await db.query(query, params);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const query = `
            SELECT o.*, 
                   pz.zone_name as pickup_zone_name,
                   dz.zone_name as drop_zone_name,
                   u.name as agent_name,
                   u.phone as agent_phone
            FROM orders o
            LEFT JOIN zones pz ON o.pickup_zone = pz.zone_id
            LEFT JOIN zones dz ON o.drop_zone = dz.zone_id
            LEFT JOIN agents a ON o.agent_id = a.agent_id
            LEFT JOIN users u ON a.user_id = u.user_id
            WHERE o.order_id = ?
        `;
        const [orders] = await db.query(query, [req.params.id]);
        if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });
        res.json(orders[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status, changed_by } = req.body;
        const orderId = req.params.id;
        
        await db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
        
        await db.query(
            'INSERT INTO tracking_history (order_id, status, changed_by) VALUES (?, ?, ?)',
            [orderId, status, changed_by || null]
        );
        
        if (['Delivered', 'Failed', 'Cancelled'].includes(status)) {
            const [orders] = await db.query('SELECT agent_id, pickup_zone FROM orders WHERE order_id = ?', [orderId]);
            if (orders.length > 0 && orders[0].agent_id) {
                await db.query('UPDATE agents SET available = 1 WHERE agent_id = ?', [orders[0].agent_id]);
                // Try auto assign asynchronously for this zone
                triggerAutoAssignForZone(orders[0].pickup_zone);
            }
        }
        
        res.json({ message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.rescheduleOrder = async (req, res) => {
    try {
        const { reschedule_date } = req.body;
        const orderId = req.params.id;
        
        await db.query(
            'UPDATE orders SET status = ?, reschedule_date = ?, agent_id = NULL WHERE order_id = ?', 
            ['Rescheduled', reschedule_date, orderId]
        );
        
        await db.query(
            'INSERT INTO tracking_history (order_id, status) VALUES (?, ?)',
            [orderId, 'Rescheduled']
        );
        
        // Trigger auto-assign logic for the zone where this order belongs, as an agent just became free.
        const [orders] = await db.query('SELECT pickup_zone FROM orders WHERE order_id = ?', [orderId]);
        if (orders.length > 0) {
            triggerAutoAssignForZone(orders[0].pickup_zone);
        }
        
        res.json({ message: 'Order rescheduled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        
        // Ensure order is in 'Order Placed' state
        const [orders] = await db.query('SELECT status FROM orders WHERE order_id = ?', [orderId]);
        if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });
        if (orders[0].status !== 'Order Placed') return res.status(400).json({ error: 'Cannot cancel order that is already being processed' });
        
        // Update status to Cancelled
        await db.query('UPDATE orders SET status = "Cancelled" WHERE order_id = ?', [orderId]);
        await db.query('INSERT INTO tracking_history (order_id, status) VALUES (?, ?)', [orderId, 'Cancelled']);
        
        res.json({ message: 'Order cancelled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
