require('dotenv').config();

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'tempuser',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'temp',
    port: process.env.DB_PORT || 5432
  },
  pool: { min: 0, max: 10 }
});

module.exports = knex;