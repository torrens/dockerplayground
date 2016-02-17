var express = require('express');
var counter = require('./counter');
var db = require('./db');

// Constants
var PORT = 8080;

// App
var app = express();

db.connect(function() {

    app.get('/', function (req, res) {
        res.send('Hello world ' + new Date());
    });

    app.get('/inc', function (req, res) {
        counter.increment(function(err, result) {
            if(err) {
                console.log(err);
            }
            res.send('Database Incremented');
        });
    });

    app.get('/count', function (req, res) {
        counter.getCount(function(err, result) {
            res.send('Count = ' + result);
        });
    });

    app.listen(PORT);
    console.log('Running on http://localhost:' + PORT);
});



