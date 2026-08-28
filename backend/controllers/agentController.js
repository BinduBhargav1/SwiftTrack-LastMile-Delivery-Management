const db = require('../db');
const { triggerAutoAssignForZone } = require('../utils/autoAssign');

exports.getAgents = async (req, res) => {
    try {
        const [agents] = await db.query(`
            SELECT a.agent_id, a.available, u.name, u.email, z.zone_name 
            FROM agents a
            JOIN users u ON a.user_id = u.user_id
            JOIN zones z ON a.zone_id = z.zone_id
        `);
        res.json(agents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.assignAgent = async (req, res) => {
    try {
        const { order_id, agent_id } = req.body;
        if (!order_id || !agent_id) return res.status(400).json({ error: 'Missing required fields' });

        // Check if already assigned
        const [orders] = await db.query('SELECT agent_id, pickup_zone FROM orders WHERE order_id = ?', [order_id]);
        if (orders.length > 0 && orders[0].agent_id) {
            // Free previous agent
            await db.query('UPDATE agents SET available = 1 WHERE agent_id = ?', [orders[0].agent_id]);
            // Attempt to assign the freed agent to a pending order in their zone
            triggerAutoAssignForZone(orders[0].pickup_zone);
        }

        await db.query('UPDATE orders SET agent_id = ?, status = ? WHERE order_id = ?', [agent_id, 'Assigned', order_id]);
        await db.query('UPDATE agents SET available = 0 WHERE agent_id = ?', [agent_id]);
        
        await db.query(
            'INSERT INTO tracking_history (order_id, status) VALUES (?, ?)',
            [order_id, 'Assigned']
        );
        
        res.json({ message: 'Agent assigned successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.getAvailability = async (req, res) => {
    try {
        const [agents] = await db.query('SELECT available FROM agents WHERE user_id = ?', [req.params.id]);
        if (agents.length === 0) return res.status(404).json({ error: 'Agent not found' });
        res.json({ available: agents[0].available === 1 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAvailability = async (req, res) => {
    try {
        const { available } = req.body;
        await db.query('UPDATE agents SET available = ? WHERE user_id = ?', [available ? 1 : 0, req.params.id]);
        
        if (available) {
            const [agents] = await db.query('SELECT zone_id FROM agents WHERE user_id = ?', [req.params.id]);
            if (agents.length > 0) triggerAutoAssignForZone(agents[0].zone_id);
        }
        
        res.json({ message: 'Availability updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
