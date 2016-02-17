"use strict";
var mysql = require('mysql');
var connection = require('./connection.json')['development'];
var pool = null;

exports.connect = function (done) {
    pool = mysql.createPool({
        host: connection.host,
        user: connection.user,
        password: connection.password,
        database: connection.database
    });
    done();
};

function get(done) {
    // Get pool
    if (!pool) return done(new Error('Missing database connection.'));
    pool.getConnection(function (err, connection) {
        if (err) {
            return done(err);
        }
        done(err, connection);
    });
}

exports.get = get;


