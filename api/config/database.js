const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'tempuser',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'temp',
  port: process.env.DB_PORT || 5432
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to Postgres');
});

module.exports = pool;