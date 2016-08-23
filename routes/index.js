var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {});
});

router.get('/user/add', function (req, res) {

    res.render('userAdd',{title:'UserAdd'});
});

router.post('/user/add', function (req, res) {
    var username = req.body.username;
    var pwd = req.body.userpwd;
    console.warn( " username = " +  username + " pwd = " + pwd);
});

router.get('/background', function (req, res) {

    res.render('background',{title:'Background'});
});

module.exports = router;
