const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function runSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Running schema.sql...');
        await connection.query(schema);
        
        console.log('Database schema and sample data inserted successfully.');
        
        await connection.end();
    } catch (err) {
        console.error('Failed schema migration', err);
        process.exit(1);
    }
}

runSchema();
