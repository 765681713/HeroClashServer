var express = require('express');
var router = express.Router();
var User = require('../bean/User').User;
var Result = require('../bean/Result');
var crypto = require('crypto');
var HeroInfoList = require('../public/json/HeroInfoList.json');
var fs = require('fs');

//app
router.post('/login', function (req, res) {
    var username = req.body.username;
    var pwd = req.body.userpwd;
    if (username && pwd) {
        User.findByName(username, function (err, user) {
            var result = new Result();
            if (err) {
                result.resultCode = Result.SERVER_EXCEPTION_ERROR_CODE;
                result.resultMessage = "服务器异常";
                res.send(result);
                return;
            }//如果存在就登录  不存在就创建
            var userpwd = crypto.createHash("md5").update(pwd).digest("hex");
            if (user && user != '') {
                User.findOne({username: username, userpwd: userpwd}, function (err, user) {
                    if (err) {
                        result.resultCode = Result.SERVER_EXCEPTION_ERROR_CODE;
                        result.resultMessage = "服务器异常";
                        res.send(result);
                        return;
                    }
                    if (!user) {
                        result.resultCode = Result.BUSINESS_ERROR_CODE;
                        result.resultMessage = "用户名或密码错误";
                        res.send(result);
                        return;
                    }
                    result.resultData = user;
                    res.send(result);
                });
            } else {
                var u = new User({username: username, userpwd: userpwd, lastLoginTime: new Date()});
                u.save(function (err,user2) {
                    if(err){
                        result.resultCode = Result.SERVER_EXCEPTION_ERROR_CODE;
                        result.resultMessage = "服务器异常";
                        res.send(result);
                        return;
                    }
                    result.resultData = user2;
                    res.send(result);//返回成功结果
                });
            }
        });
    }
});

//浏览器
router.get('/', function (req, res, next) {
    var heroes = [];
    var i = 0;
    while (true){
        var id = 2001 + i;
        var json = HeroInfoList[id];
        if(json){//&& json !== undefined && json !== ""
            heroes.push(json);
            i++;
        }else{
            break;
        }
    }
    res.render('index', {
        heroes:heroes,
        user:req.session.user
    });
});

router.post('/loginUp',function (req,res) {
    var userName = req.body.userName;
    var pwd = req.body.userPwd;
    if (userName && pwd) {
        User.findByName(userName,function (err,user) {
            if(err){
                console.warn("err = " + err);
                res.redirect('/');
                return;
            }
            if(user){
                var userPwd = crypto.createHash("md5").update(pwd).digest("hex");
                User.findOne({username: userName, userpwd: userPwd}, function (err, user) {
                    if(err){
                        console.warn("err = " + err);
                        res.redirect('/');
                        return;
                    }
                    if(user){
                        req.session.user = user;
                        res.redirect('/');
                    }else{
                        res.redirect('/');
                    }
                });
            }else{
                res.redirect('/');
            }
        });
    }else{
        res.redirect('/');
    }
});

router.get('/background', function (req, res) {

    res.render('background', {title: 'Background'});
});

module.exports = router;
