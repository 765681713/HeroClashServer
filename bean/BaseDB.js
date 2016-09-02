var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/HeroClash');//HeroClash 数据库默认名称
module.exports.mongoose = mongoose;
