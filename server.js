const fs = require('fs');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config.js');
const expressjwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const models = require('./schema/index');
global.__base = __dirname;

const port = config.port;

const app = express();
const server = require('http').createServer(app);

app.config = config;
app.jwt = jwt;
app.bcrypt = bcrypt;
app.expressjwt = expressjwt;

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
	console.log(config.mongodb.uri);
});
// Middleware
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
models(app, mongoose);
app.get('/auth/userDetails', function (req, res) {
	res.json({ message: "success" });
});
app.get('/auth/user', function (req, res) {
	res.json({ message: "success" });
});

server.listen(port);

console.log('The magic happens on port ' + port);