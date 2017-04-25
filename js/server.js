//  OpenShift sample Node application
var express = require('express'),
    http = require('http'),
    request = require('request'),
    fs = require('fs'),
    app = express(),
    path = require("path"),
    port = process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    appConfig = require('./config.js');

// error handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something bad happened!');
});

app.get('/config.json', function (req, res, next) {
    res.json(appConfig);
});

app.use(express.static(path.join(__dirname, '/views')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));

http.createServer(app).listen(port);

console.log('HTTP Server running on http://%s:%s', ip, port);

module.exports = app;
