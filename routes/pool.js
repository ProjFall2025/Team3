const { Pool } = require('pg');
const pool = new Pool({
  user: 'tempuser',
  host: 'localhost',
  database: 'CS 690',
  password: 'password',
  port: 5432,
});
module.exports = pool;