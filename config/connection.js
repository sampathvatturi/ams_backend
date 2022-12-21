const mysql = require('mysql2');
require('dotenv').config();

// Initialize pool
var connection      =    mysql.createPool({
    connectionLimit : 10,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    debug    :  false
});    
module.exports = connection;