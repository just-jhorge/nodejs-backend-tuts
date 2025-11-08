const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "node-backend-tuts",
});

module.exports = pool.promise();
