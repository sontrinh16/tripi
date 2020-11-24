const mysql = require('mysql');

const con = mysql.createConnection({
    host: '35.198.247.201',
    user: 'root',
    password: 'hentaimaster9000',
    port: '3306',
    database: 'tripi'
  });

con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con;