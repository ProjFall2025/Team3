const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const routeModules = ['auth', 'comment', 'model', 'sheet', 'user'];
routeModules.forEach(route => {
    const modulePath = `./api/routes/${route}`;
    app.use(`/api/${route}`, require(modulePath));
});

app.use(express.static(path.join(__dirname, 'app/build')));

const ROOT_HTML = path.join(__dirname, 'app/build/index.html');

// React Router
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// React app
const routes = ['/', '/about', '/login'];
app.get(routes, (req, res) => { res.sendFile(ROOT_HTML); });


// start server
const PORT = process.env.PORT || 3000;
let server = app.listen(PORT,() => {
    const serverAddress = server.address();
    console.log(`Visit at: http://${serverAddress.address}:${serverAddress.port}/`)
    console.log('Press Ctrl+C to quit.');
});