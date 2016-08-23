var express = require("express");
var sockIo = require('socket.io');
var path = require('path');
var routes = require('./routes/index.js');
var sqlite3 = require('sqlite3');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var databasePath = 'public/database/HeroClash.sqlite3';
module.exports = function (server, app) {
    var socketIo = sockIo.listen(server , null);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', routes);
    var db = new sqlite3.Database(databasePath);
    db.run("create table if not exists Note (cdate text primary key ,content text)");
    db.close();
    
    socketIo.on('connection',function (socket) {
        console.log('  connection HeroClash ing .... ');



        // socket.on('findAll', function (data) {
        //     var db = new sqlite3.Database(databasePath);
        //     db.all("select cdate,content from Note", function (err, res) {
        //         if (!err) {
        //             var jsonObj = {
        //                 ResultCode: 0, Record: res
        //             };
        //             socket.emit('findAllCallBack', jsonObj);
        //         }
        //     });
        // });
        // socket.on('create', function (data) {
        //     var db = new sqlite3.Database(databasePath);
        //     var stmt = db.prepare("insert or replace into  Note(cdate,content) values (?,?) ");
        //     var json = JSON.parse(data);
        //     var cdate = json.cdate; //json    json[""] 数组 json.content  jsonObject
        //     var content = json.content;
        //     stmt.run(cdate, content);
        //     stmt.finalize();
        //     db.close();
        //     socket.emit('createCallBack', {
        //         ResultCode: 0
        //     });
        // });
        // socket.on('remove', function (data) {
        //     var db = new sqlite3.Database(databasePath);
        //     var json = JSON.parse(data);
        //     var cdate = json.cdate;
        //     var stmt = db.prepare("delete from Note where cdate = ?");
        //     stmt.run(cdate);
        //     stmt.finalize();
        //     db.close();
        //     socket.emit('removeCallBack', {
        //         ResultCode: 0
        //     });
        // });
        // socket.on('modify', function (data) {
        //     var db = new sqlite3.Database(databasePath);
        //     var json = JSON.parse(data);
        //     var cdate = json.cdate;
        //     var content = json.content;
        //     var stmt = db.prepare("update Note set content = ? where cdate = ?");
        //     stmt.run(content, cdate);
        //     stmt.finalize();
        //     db.close();
        //     socket.emit('modifyCallback', {
        //         ResultCode: 0
        //     });
        // });
    });

    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};

