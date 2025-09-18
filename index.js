const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'app/build')));

// API routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend connected successfully!' });
});

// React app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/build/index.html'));
});

// start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`Visit at: http://localhost:8080/`)
    console.log('Press Ctrl+C to quit.');
});