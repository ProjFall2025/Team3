var express = require('express');
var app = module.exports = express();
const pool = require('../pool');


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

// validate user
app.get('/validate/user', async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await pool.query(
      `select id, is_locked from users where (username = $1 or email = $2) and deleted = false`,
      [username || '', email || '']
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or email.' });
    }
    if (result.rows[0]['is_locked'] == true){
      return res.status(403).json({ error: "This account is locked" })
    }
    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// validate password
app.get('/validate/password', async (req, res) => {
  const { id, password } = req.body;
  try {
    const result = await pool.query(`select id, password, num_failed_attempts from users where id = $1`, [id]);
    if (!(result.rows[0]['password'] === password)) {
      pool.query(`insert into login_attempts (user_id, succeeded, ip_address) values ($1, $2, $3)`,
        [id, false, req.ip]);
      if (result.rows[0]['num_failed_attempts'] == 4){
        return res.status(403).json({ message: "Invalid password, your account has been locked." })
      }
      return res.status(401).json({ message: 'Invalid password' });
    }
    pool.query(`insert into login_attempts (user_id, succeeded, ip_address) values ($1, $2, $3)`,
      [id, true, req.ip]);
    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
