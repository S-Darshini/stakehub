
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: 'password', 
    database: 'RMT_PORTAL' 
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = connection;
