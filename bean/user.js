//var uts = require('../utils/util');
var mongoose = require('./BaseDB').mongoose;
var Schema = mongoose.Schema;
//var ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
    username:String,
    userpwd:String,
    lastLoginTime:Date,
    createTime:{type:Date,default:Date.now}
});

UserSchema.statics.findByName = function (name,callback) {
    this.find({username:new RegExp(name,'i')},callback);
};

var User = mongoose.model('User',UserSchema,'user');//指定在数据库中的collection名称为user

User.close = function () {
    mongoose.close();
};

module.exports.User = User;


// username : {type : String, default : '匿名用户'},
// title    : {type : String},
// content  : {type : String},
// time     : {type : Date, default: Date.now},
// age      : {type : Number}

//     name:String,
//     binary:Buffer,
//     living:Boolean,
//     updated:Date,
//     age:Number,
//     mixed:Schema.Types.Mixed, //该混合类型等同于nested
//     _id:Schema.Types.ObjectId,  //主键
//     _fk:Schema.Types.ObjectId,  //外键
//     array:[],
//     arrOfString:[String],
//     arrOfNumber:[Number],
//     arrOfDate:[Date],
//     arrOfBuffer:[Buffer],
//     arrOfBoolean:[Boolean],
//     arrOfMixed:[Schema.Types.Mixed],
//     arrOfObjectId:[Schema.Types.ObjectId]
