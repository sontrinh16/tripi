const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.join(__dirname, 'config.env')});

const con = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    port: process.env.SQL_PORT,
    database: process.env.SQL_DATABASE
  });

con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con;