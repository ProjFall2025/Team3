var express = require('express');
var app = module.exports = express();
const pool = require('../pool');

// get all models
app.get('/api/models', (req, res) => {
  pool.query('select * from models', (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else if (results.rows.length === 0) {
      res.status(404).json({ message: 'No models found' });
    } else {
      res.status(200).json(results.rows[0]);
    }
  });
});