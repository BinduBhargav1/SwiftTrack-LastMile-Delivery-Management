require('dotenv').config({ path: '../backend/.env' });
const db = require('../backend/db');

async function migrate() {
    try {
        console.log('Running migration...');
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS points (
                point_id INT PRIMARY KEY AUTO_INCREMENT,
                zone_id INT NOT NULL,
                point_name VARCHAR(255) NOT NULL,
                FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
            )
        `);
        console.log('Created points table');

        const [rows] = await db.query('SELECT COUNT(*) as count FROM points');
        if (rows[0].count === 0) {
            await db.query(`
                INSERT INTO points (zone_id, point_name) VALUES 
                ((SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad North'), 'Kukatpally'),
                ((SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad North'), 'Miyapur'),
                ((SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad South'), 'Gachibowli'),
                ((SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad South'), 'Madhapur'),
                ((SELECT zone_id FROM zones WHERE zone_name = 'Vijayawada'), 'Benz Circle'),
                ((SELECT zone_id FROM zones WHERE zone_name = 'Guntur'), 'Arundelpet');
            `);
            console.log('Inserted sample points');
        }
        
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
