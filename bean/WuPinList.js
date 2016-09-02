var mongoose = require('./BaseDB').mongoose;
var Schema = mongoose.Schema;

var WuPinListSchema = new Schema({
    id:Number,
    _fk:Schema.Types.ObjectId,
    title:String,
    name:String,
    desc:String,
    icon:String,
    num:{type:Number,default:1},
    proterties:{}

});

WuPinListSchema.statics.findWuPinsByUserId = function (id,callback) {
    this.find({_fk:id},callback);
};

WuPinListSchema.statics.findWuPinById = function (userId,wuPinId,callback) {
    this.findOne({id:wuPinId,_fk:userId},callback);
};

var WuPinList = mongoose.model('WuPinList',WuPinListSchema,'wuPinList');

WuPinList.close = function () {
    mongoose.close();
};

module.exports.WuPinList = WuPinList;
