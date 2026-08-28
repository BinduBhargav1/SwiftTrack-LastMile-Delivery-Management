require('dotenv').config({ path: '../backend/.env' });
const db = require('../backend/db');

async function migrate() {
    try {
        console.log('Running agent approval migration...');
        
        await db.query(`
            ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT 1;
        `);
        console.log('Added is_approved to users');

        // Existing agents should be approved
        await db.query(`
            UPDATE users SET is_approved = 1 WHERE role = 'agent';
        `);
        
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        // Ignore if column already exists
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists. Skipping...');
            process.exit(0);
        }
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
