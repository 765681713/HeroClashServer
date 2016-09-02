var express = require('express');
var router = express.Router();
var User = require('../bean/User').User;
var Result = require('../bean/Result');
var crypto = require('crypto');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {});
});

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

router.get('/background', function (req, res) {

    res.render('background', {title: 'Background'});
});

module.exports = router;
