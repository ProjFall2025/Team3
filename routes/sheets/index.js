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


// rate a sheet
app.post('/api/sheets/rate', (req, res) => {
    const { user_id, sheet_id, rating } = req.body;
    pool.query(
        'insert into sheet_ratings (user_id, sheet_id, rating) values ($1, $2, $3) returning *',
        [user_id, sheet_id, rating],
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


// soft delete sheet
app.delete('/api/sheets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(
        'delete from sheets where id = $1 returning *',
        [id],
        (error, results) => {
            if (error) {
                res.status(500).json({ error: error.message });
            } else if (results.rows.length === 0) {
                res.status(404).json({ message: 'Sheet not found or already deleted' });
            } else {
                res.status(200).json({ message: 'Sheet deleted', sheet: results.rows[0] });
            }
        }
    );
});


// update sheet
// MARK: Needs testing, adjust for when not all values are there.
app.patch('/api/sheets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, artist, description, instrument, visibility } = req.body;
    pool.query(
        'update sheets set username = $1, email = $2, password = $3, bio = $4 where id = $5 AND deleted = false returning *',
        [ title, artist, description, instrument, visibility, id],
        (error, results) => {
            if (error) {
                res.status(500).json({ error: error.message });
            } else if (results.rows.length === 0) {
                res.status(404).json({ message: 'Sheet not found or deleted' });
            } else {
                res.status(200).json(results.rows[0]);
            }
        }
    );
});

// NOTE: a 404 is not actually a 404, that is a logic error when doing the check (results.rows.length===0); nothing is sent back on delete.