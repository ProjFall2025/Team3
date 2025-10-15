var express = require('express');
var app = module.exports = express();
const pool = require('../pool');

// add a new comment
app.post('/api/mkcomment', (req, res) => {
  const { sheet, created_by, content } = req.body;
  pool.query(
    'insert into comments (sheet, created_by, content) values ($1, $2, $3) returning *',
    [ sheet, created_by, content ],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(201).json(results.rows[0]);
      }
    }
  );
});


// soft delete comment
app.delete('/api/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    'delete from comments where id = $1 returning *',
    [id],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else if (results.rows.length === 0) {
        res.status(404).json({ message: 'Comment not found or already deleted' });
      } else {
        res.status(200).json({ message: 'Comment deleted', comment: results.rows[0] });
      }
    }
  );
});
