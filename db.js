const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost', user: 'root', password: '', database: 'secolab_db'
});
connection.connect(error => {
    if (error) throw error;
    console.log("Database terkoneksi!");
});
module.exports = connection;