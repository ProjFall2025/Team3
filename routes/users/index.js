var express = require('express');
var app = module.exports = express();
const pool = require('../pool');

// get user by id
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('select id, username, email, bio, is_admin, is_locked, created_at, last_logged_in from users where id = $1 and deleted = false', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else if (results.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(results.rows[0]);
    }
  });
});


// follow another user
app.post('/api/users/follow', (req, res) => {
  const { follower,followee } = req.body;
  pool.query(
    'insert into user_follows (follower, followee) values ($1, $2) returning *',
    [ follower, followee ],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(201).json(results.rows[0]);
      }
    }
  );
});


// get all of users followers
app.get('/api/users/following/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    'select u.* from user_follows uf, users u where followee = $1 and follower = u.id', [id],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(201).json(results.rows);
      }
    }
  );
});


// get all of users sheets
app.get('/api/users/sheets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    'select * from sheets where created_by = $1', [id],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(201).json(results.rows);
      }
    }
  );
});


// get all of users comments
app.get('/api/users/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    'select * from comments where created_by = $1', [id],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(201).json(results.rows);
      }
    }
  );
});


// update user
// MARK: test route, probably redo
app.patch('/api/users/:id', (req, res) => {
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
app.patch('/api/users/mkadmin/:id', (req, res) => {
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
// MARK: test route, maybe redo
app.patch('/api/users/restore/:id', (req, res) => {
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
    'delete from users where id = $1 returning *',
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