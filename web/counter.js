'use strict';
var db = require('./db');

exports.increment = function (done) {
    db.get(function (err, connection) {
        if (err) {
            return done(err);
        }
        connection.query("UPDATE COUNTER SET COUNT = COUNT + 1 WHERE ID = 1", function (err, result) {
            if (err) {
                return done(err);
            }
            console.log('Incremented count');
            connection.destroy();
            done(null, result);
        });
    });
};

exports.getCount = function (done) {
    db.get(function (err, connection) {
        if (err) {
            return done(err);
        }
        connection.query("SELECT * FROM COUNTER WHERE id = 1", function (err, rows) {
            if (err) {
                return done(err);
            }
            console.log('Get count = ' + rows[0].count);
            connection.destroy();
            done(null, rows[0].count);
        });
    });
};

