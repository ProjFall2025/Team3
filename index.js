const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'app/build')));

const ROOT_HTML = path.join(__dirname, 'app/build/index.html');

// React Router
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// API routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend connected successfully!' });
});

// React app
const routes = ['/', '/about', '/login'];
app.get(routes, (req, res) => { res.sendFile(ROOT_HTML); });


// start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`Visit at: http://localhost:${PORT}/`)
    console.log('Press Ctrl+C to quit.');
});