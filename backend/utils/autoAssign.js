const db = require('../db');

exports.triggerAutoAssignForZone = async (zone_id) => {
    let assignmentsMade = 0;
    try {
        while (true) {
            // Find oldest unassigned order in this zone
            const [orders] = await db.query(
                "SELECT order_id FROM orders WHERE pickup_zone = ? AND status IN ('Order Placed', 'Rescheduled') AND agent_id IS NULL ORDER BY created_at ASC LIMIT 1",
                [zone_id]
            );
            
            if (orders.length === 0) break;
            
            // Find an available agent in this zone
            const [agents] = await db.query(
                "SELECT agent_id FROM agents WHERE zone_id = ? AND available = 1 LIMIT 1",
                [zone_id]
            );
            
            if (agents.length === 0) break;
            
            const order_id = orders[0].order_id;
            const agent_id = agents[0].agent_id;
            
            // Assign order
            await db.query('UPDATE orders SET agent_id = ?, status = ? WHERE order_id = ?', [agent_id, 'Assigned', order_id]);
            await db.query('UPDATE agents SET available = 0 WHERE agent_id = ?', [agent_id]);
            await db.query('INSERT INTO tracking_history (order_id, status) VALUES (?, ?)', [order_id, 'Assigned']);
            
            assignmentsMade++;
        }
    } catch (err) {
        console.error('Auto-assign failed for zone', zone_id, ':', err);
    }
    return assignmentsMade;
};
