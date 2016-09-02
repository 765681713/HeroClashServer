var express = require("express");
var sockIo = require('socket.io');
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var routes = require('./routes/index.js');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var User = require('./bean/User').User;
var UserInfo = require('./bean/UserInfo').UserInfo;
var Result = require('./bean/Result');
var Util = require('./utils/util');
var HeroList = require('./bean/HeroList').HeroList;
var WuPinList = require('./bean/WuPinList').WuPinList;

module.exports = function (server, app) {
    var socketIo = sockIo.listen(server, null);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', routes);

    socketIo.on('connection', function (socket) {

        console.warn('  connection HeroClash ing .... ');

        socket.on(Util.EmitEvent_UserInfo, function (data) {
            var json = JSON.parse(data);
            var username = json.username;
            var pwd = json.userpwd;
            userpwd = crypto.createHash("md5").update(pwd).digest("hex");
            //console.warn('  getUserInfo  userpwd =  ' + userpwd + " username = " + username);
            User.findOne({username: username, userpwd: userpwd}, function (err, user) {
                if (err) {
                    console.warn("User.findOne = " + err);
                    return;
                }
                if(user){
                    UserInfo.findById(user._id,function (err,userInfo) {
                        if(err){
                            console.warn("UserInfo.findOne = " + err);
                            return;
                        }
                        if(userInfo && userInfo != ''){
                            var result = new Result();
                            result.resultData = userInfo;
                            socket.emit('getUserInfo', result);
                        }else{
                            var info = new UserInfo({_fk:user._id,name:username});
                            info.save(function (err,row) {
                                if(err){
                                    console.warn("info.save = " + err);
                                    return;
                                }
                                if(row){
                                    var result = new Result();
                                    result.resultData = row;
                                    socket.emit(Util.EmitEvent_UserInfo, result);
                                }
                            });
                        }
                    });
                }
            });
        });

        socket.on(Util.EmitEvent_HeroList,function (data) {
            var json = JSON.parse(data);
            var _id = json._id;
            HeroList.findHeroesByUserId(_id,function (err,heroes) {
                if(err){
                    console.warn(" HeroList.findHeroesByUserId " + err);
                    return;
                }
                var result = new Result();
                result.resultData = heroes;
                socket.emit(Util.EmitEvent_HeroList, result);
            });
        });

        socket.on(Util.EmitEvent_WuPinList,function (data) {
            var json = JSON.parse(data);
            var _id = json._id;
            WuPinList.findWuPinsByUserId(_id,function (err,wupins) {
                if(err){
                    console.warn(" WuPinList.findWuPinsByUserId" + err);
                    return;
                }
                var result = new Result();
                result.resultData = wupins;
                socket.emit(Util.EmitEvent_WuPinList, result);
            })
        });

        socket.on(Util.EmitEvent_UpdateHero,function (data) {
            var json = JSON.parse(data);
            var _id = json._id;
            var heroId = json.heroId;
            HeroList.findHeroByUser(_id,heroId,function (err,hero) {
                if(err){
                    console.warn(" HeroList.findHeroByUser " + err);
                    return;
                }
                if(hero && hero != ""){
                    //console.log("  findHeroByUser  hero =" + hero);
                }else{
                    fs.readFile("./public/json/HeroInfoList.json",'utf-8',function (err,heroesData) {
                        if(err){
                            console.warn(" fs.readFile ./public/json/HeroInfoList.json" + err);
                            return;
                        }
                        var heroList = JSON.parse(heroesData);
                        var heroInfo = heroList[heroId];
                        if(heroInfo){
                            heroInfo["_fk"] = _id;
                            var h = new HeroList(heroInfo);
                            h.save(function (err,row) {
                                if(err){
                                    console.warn("HeroList h.save " + err);
                                }
                                var result = new Result();
                                //result.resultData = row;
                                socket.emit(Util.EmitEvent_UpdateHero, result);
                            });
                        }
                    });
                }
            })
        });

        socket.on(Util.EmitEvent_UpdateWuPinNum,function (data) {
            var json = JSON.parse(data);
            var _id = json._id;
            var wuPinId = json.wuPinId;
            WuPinList.findWuPinById(_id,wuPinId,function (err,wupin) {
                if(err){
                    console.warn(" WuPinList.findWuPinById " + err);
                    return;
                }
                //先判断类型 在加减
                if(wupin && wupin != ""){
                    var num = parseInt(wupin.num);
                    num ++;
                    WuPinList.update({id:wuPinId,_fk:_id},{$set:{num:num}},function(err){});
                }else{
                    fs.readFile("./public/json/WuPinInfoList.json",'utf-8',function (err,wupinData) {
                        if(err){
                            console.warn(" fs.readFile ./public/json/WuPinInfoList.json" + err);
                            return;
                        }
                        var wupinJson = JSON.parse(wupinData);
                        var wp = wupinJson[wuPinId];
                        if(wp){
                            wp["_fk"] = _id;
                            var wuPin = new WuPinList(wp);
                            wuPin.save(function (err,row) {
                                if(err){
                                    console.warn(" wuPin.save " + err);
                                }
                                var result = new Result();
                                //result.resultData = row;
                                socket.emit(Util.EmitEvent_UpdateWuPinNum, result);
                            });
                        }
                    });
                }
            });
        });

        socket.on('disconnect', function () {
            console.log('  HeroClash disconnect ');
        });
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

