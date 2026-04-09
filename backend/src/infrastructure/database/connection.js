const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASS || "adminpassword",
  database: process.env.DB_NAME || "fintech_database",
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
