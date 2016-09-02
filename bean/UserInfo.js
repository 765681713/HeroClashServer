var mongoose = require('./BaseDB').mongoose;
var Schema = mongoose.Schema;

var UserInfoSchema = new Schema({
    _fk:Schema.Types.ObjectId,
    level:{type : Number,default:1},
    expNow:{type : Number,default:0},
    expNed:{type : Number,default:50},
    icon:{type : String,default:'monster_ai_icon_4.png'},
    name:String,
    hp:{type : Number,default:20},
    def:{type : Number,default:2},
    mp:{type : Number,default:15},
    heroesCount:{type : Number,default:15},
    act:{type : Number,default:3},
    heroesId:[Number],
    wupinId:[Number],
    glodNum:{type : Number,default:1000},
    zuanShiNum:{type : Number,default:0},
    tiLiNum:{type : Number,default:30},
    tiLiNumCount:{type : Number,default:50}
});

UserInfoSchema.statics.findById = function (id,callback) {
    this.findOne({_fk:id},callback);
};

var UserInfo = mongoose.model('UserInfo',UserInfoSchema,'userInfo');

UserInfo.close = function () {
    mongoose.close();
};

module.exports.UserInfo = UserInfo;


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
