var express = require('express');
var app = module.exports = express();
const pool = require('../pool');


// make a new sheet
app.post('/api/mksheet', (req, res) => {
  const { created_by, model, title, artist, description, instrument, visibility } = req.body;
  pool.query(
    'insert into sheets (created_by, model, title, artist, description, instrument, visibility) values ($1, $2, $3, $4, $5, $6, $7) returning *',
    [created_by, model, title, artist, description || '', instrument, visibility || ''],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(201).json(results.rows[0]);
      }
    }
  );
});

// get sheet by id
app.get('/api/sheets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('select * from sheets where id = $1 and deleted = false', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else if (results.rows.length === 0) {
      res.status(404).json({ message: 'Sheet not found' });
    } else {
      res.status(200).json(results.rows[0]);
    }
  });
});

// TODO: Add sheet deletion, modification