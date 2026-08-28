const mysql = require('mysql2/promise');
require('dotenv').config({path: '../backend/.env'});
(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });
  await connection.query('DROP DATABASE IF EXISTS lastmile_delivery;');
  await connection.query('CREATE DATABASE lastmile_delivery;');
  console.log('Recreated DB');
  process.exit(0);
})();
