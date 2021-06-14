const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Create a new express application called 'app'
const app = express();

// Set our backend port to be either an environment variable or port 3080
const port = (process.env.NODE_ENV === 'test')?5000:(process.env.PORT || 3080);

const buildPath = path.join(__dirname, 'client/build');
app.use(express.static(buildPath));

// This application level middleware prints incoming requests to the servers console
app.use((req, res, next) => {
    console.log(`Request_Endpoint: ${req.method} ${req.url}`);
    next();
});

// Set up the bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Set up the CORs middleware
app.use(cors());

// Require Route
const api = require('./routes/api');

// Configure app to use route
app.use('/api/v1.0', api);

app.get('/success', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// This middleware informs the express application to serve our compiled React files
/*if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
};

app.get('/', (req,res) => {
    res.send('Load app');
});*/

// Catch any bad requests
app.get('*', (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

// Set our server to listen on the port defiend by our port variable
app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;