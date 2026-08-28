const db = require('../db');

exports.getTrackingHistory = async (req, res) => {
    try {
        const orderId = req.params.id;
        const [history] = await db.query(
            'SELECT * FROM tracking_history WHERE order_id = ? ORDER BY changed_at ASC',
            [orderId]
        );
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
