require("dotenv").config();
const mysql = require("mysql2");

const hostEnv = process.env.DB_HOST || "localhost";
const [host, port] = hostEnv.split(":");

const connection = mysql.createConnection({
  host: host,
  port: port ? Number(port) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000,
  ssl: {
    rejectUnauthorized: false
  }
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  } else {
    console.log("Connected to Synq MySQL database");
  }
});

module.exports = connection;