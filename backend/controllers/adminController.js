const db = require('../db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders');
        const [activeAgents] = await db.query('SELECT COUNT(*) as count FROM agents WHERE available = 1');
        const [delayedOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Failed'");
        
        const [revenue] = await db.query("SELECT SUM(delivery_charge) as total FROM orders WHERE status = 'Delivered'");

        res.json({
            total_orders: totalOrders[0].count,
            active_agents: activeAgents[0].count,
            delayed_orders: delayedOrders[0].count,
            total_revenue: revenue[0].total || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getZones = async (req, res) => {
    try {
        const [zones] = await db.query('SELECT * FROM zones');
        res.json(zones);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRates = async (req, res) => {
    try {
        const [rates] = await db.query(`
            SELECT r.rate_id, r.order_type, r.rate_per_kg, r.cod_surcharge, z1.zone_name as from_zone_name, z2.zone_name as to_zone_name 
            FROM rate_cards r
            JOIN zones z1 ON r.from_zone = z1.zone_id
            JOIN zones z2 ON r.to_zone = z2.zone_id
        `);
        res.json(rates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createZone = async (req, res) => {
    try {
        const { zone_name } = req.body;
        await db.query('INSERT INTO zones (zone_name) VALUES (?)', [zone_name]);
        res.json({ message: 'Zone created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createRateCard = async (req, res) => {
    try {
        const { from_zone, to_zone, order_type, rate_per_kg, cod_surcharge } = req.body;
        await db.query(
            'INSERT INTO rate_cards (from_zone, to_zone, order_type, rate_per_kg, cod_surcharge) VALUES (?, ?, ?, ?, ?)',
            [from_zone, to_zone, order_type, rate_per_kg, cod_surcharge]
        );
        res.json({ message: 'Rate card created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllAgents = async (req, res) => {
    try {
        const [agents] = await db.query(`
            SELECT a.*, u.name, u.email, u.phone, z.zone_name 
            FROM agents a 
            JOIN users u ON a.user_id = u.user_id
            JOIN zones z ON a.zone_id = z.zone_id
        `);
        res.json(agents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPoints = async (req, res) => {
    try {
        const [points] = await db.query(`
            SELECT p.*, z.zone_name 
            FROM points p 
            JOIN zones z ON p.zone_id = z.zone_id
        `);
        res.json(points);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createPoint = async (req, res) => {
    try {
        const { zone_id, point_name } = req.body;
        await db.query('INSERT INTO points (zone_id, point_name) VALUES (?, ?)', [zone_id, point_name]);
        res.status(201).json({ message: 'Point created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAgent = async (req, res) => {
    try {
        const { name, email, phone, zone_id, password } = req.body;
        const [uRes] = await db.query(
            "INSERT INTO users (name, email, phone, password, role, is_approved) VALUES (?, ?, ?, ?, 'agent', 1)",
            [name, email, phone, password || '123456']
        );
        await db.query(
            "INSERT INTO agents (user_id, zone_id, available) VALUES (?, ?, 1)",
            [uRes.insertId, zone_id]
        );
        res.json({ message: 'Agent created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPendingAgents = async (req, res) => {
    try {
        const [agents] = await db.query('SELECT user_id, name, email, phone FROM users WHERE role = "agent" AND is_approved = 0');
        res.json(agents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.approveAgent = async (req, res) => {
    try {
        const { user_id, zone_id } = req.body;
        await db.query('UPDATE users SET is_approved = 1 WHERE user_id = ?', [user_id]);
        await db.query('INSERT INTO agents (user_id, zone_id, available) VALUES (?, ?, 1)', [user_id, zone_id]);
        res.json({ message: 'Agent approved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.rejectAgent = async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE user_id = ? AND is_approved = 0', [req.params.id]);
        res.json({ message: 'Agent rejected' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAgent = async (req, res) => {
    try {
        const agentId = req.params.id;
        
        // Check for active orders
        const [orders] = await db.query("SELECT * FROM orders WHERE agent_id = ? AND status NOT IN ('Delivered', 'Cancelled', 'Failed')", [agentId]);
        if (orders.length > 0) {
            return res.status(400).json({ error: 'Cannot delete agent with active assigned orders. Reassign the orders first.' });
        }
        
        // Find user_id before deleting agent
        const [agents] = await db.query('SELECT user_id FROM agents WHERE agent_id = ?', [agentId]);
        if (agents.length === 0) return res.status(404).json({ error: 'Agent not found' });
        const userId = agents[0].user_id;

        // Delete from agents, then users
        await db.query('DELETE FROM agents WHERE agent_id = ?', [agentId]);
        await db.query('DELETE FROM users WHERE user_id = ?', [userId]);
        
        res.json({ message: 'Agent deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
