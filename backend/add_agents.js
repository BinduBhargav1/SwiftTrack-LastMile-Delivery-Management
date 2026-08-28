const db = require('./db');

async function addAgents() {
    try {
        const [hydSouth] = await db.query("SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad South'");
        const [vij] = await db.query("SELECT zone_id FROM zones WHERE zone_name = 'Vijayawada'");
        const [gun] = await db.query("SELECT zone_id FROM zones WHERE zone_name = 'Guntur'");

        const agents = [
            { name: 'Kiran Agent', email: 'kiran@swifttrack.com', phone: '4444444444', zone_id: hydSouth[0].zone_id },
            { name: 'Rahul Agent', email: 'rahul@swifttrack.com', phone: '5555555555', zone_id: hydSouth[0].zone_id },
            { name: 'Priya Agent', email: 'priya@swifttrack.com', phone: '6666666666', zone_id: vij[0].zone_id },
            { name: 'Manoj Agent', email: 'manoj@swifttrack.com', phone: '7777777777', zone_id: gun[0].zone_id }
        ];

        for (const ag of agents) {
            const [uRes] = await db.query(
                "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, '123456', 'agent')",
                [ag.name, ag.email, ag.phone]
            );
            await db.query(
                "INSERT INTO agents (user_id, zone_id, available) VALUES (?, ?, 1)",
                [uRes.insertId, ag.zone_id]
            );
        }
        console.log('Added 4 new agents successfully');
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
addAgents();
