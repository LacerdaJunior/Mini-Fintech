
const { Pool } = require('pg');


const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'fintech_database',
  password: 'adminpassword',
  port: 5432,
});

module.exports = pool;