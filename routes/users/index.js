var express = require('express');
var app = module.exports = express();
const pool = require('../pool');

// get user by id
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('select * from users where id = $1 and deleted = false', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else if (results.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(results.rows[0]);
    }
  });
});


// update user
app.put('/api/users/restore/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { username, email, password, bio } = req.body;
  pool.query(
    'update users set username = $1, email = $2, password = $3, bio = $4 where id = $5 AND deleted = false returning *',
    [username, email, password, bio, id],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else if (results.rows.length === 0) {
        res.status(404).json({ message: 'User not found or deleted' });
      } else {
        res.status(200).json(results.rows[0]);
      }
    }
  );
});

// make user admin
app.put('/api/users/mkadmin/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    'update users set is_admin = true where id = $1 and deleted = false returning *', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else if (results.rows.length === 0) {
        res.status(404).json({ message: 'User not found or deleted' });
      } else {
        res.status(200).json(results.rows[0]);
      }
    }
  );
});

// restore user
app.patch('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    'update users set deleted = false where id = $1 returning *', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else if (results.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json(results.rows[0]);
      }
    }
  );
});

// soft delete user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    'update users set deleted = true where id = $1 and deleted = false returning *',
    [id],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else if (results.rows.length === 0) {
        res.status(404).json({ message: 'User not found or already deleted' });
      } else {
        res.status(200).json({ message: 'User deleted', user: results.rows[0] });
      }
    }
  );
});