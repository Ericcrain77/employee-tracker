const mysql = require('mysql2');

require('dotenv').config();

const dbcon = mysql.createConnection(
    {
        host: 'localhost',
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PW
    }
);

module.exports = dbcon;