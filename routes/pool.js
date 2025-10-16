const { Pool } = require('pg');
const pool = new Pool({
  user: 'tempuser',
  host: 'localhost',
  database: 'Knowtes',
  password: 'password',
  port: 5434,
});
module.exports = pool;