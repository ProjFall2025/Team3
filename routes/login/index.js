var express = require('express');
var app = module.exports = express();
const pool = require('../pool');

// validate user
app.post('/validate', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      `select * from users where (username = $1 or email = $2) and password = $3 and deleted = false`,
      [username || '', email || '', password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// register user
app.post('/register', (req, res) => {
  const { username, email, password, bio } = req.body;
  pool.query(
    'insert into users (username, email, password, bio) values ($1, $2, $3, $4) returning *',
    [username, email, password, bio || ''],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(201).json(results.rows[0]);
      }
    }
  );
});