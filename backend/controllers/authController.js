const db = require('../db');

exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });
        
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ error: 'Email already exists' });
        
        const finalRole = role === 'agent' ? 'agent' : 'customer';
        const isApproved = finalRole === 'agent' ? 0 : 1;
        
        const [result] = await db.query(
            'INSERT INTO users (name, email, phone, password, role, is_approved) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, phone, password, finalRole, isApproved]
        );
        
        res.status(201).json({ user_id: result.insertId, name, email, role: finalRole });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Missing required fields' });
        
        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid login credentials' });
        
        const user = users[0];
        
        if (user.role === 'agent' && !user.is_approved) {
            return res.status(403).json({ error: 'Account pending admin approval' });
        }
        res.json({
            user_id: user.user_id,
            name: user.name,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
