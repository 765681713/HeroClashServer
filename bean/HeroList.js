var mongoose = require('./BaseDB').mongoose;
var Schema = mongoose.Schema;

var HeroListSchema = new Schema({
    id: Number,
    _fk: Schema.Types.ObjectId,
    title: String,
    name: String,
    desc: String,
    icon: String,
    atkEffect: String,
    skillEffect: String,
    tag: Number,
    hp: {type: Number, default: 0},
    pAtk: {type: Number, default: 0},
    sAtk: {type: Number, default: 0},
    pDef: {type: Number, default: 0},
    sDef: {type: Number, default: 0},
    round: {type: Number, default: 0},
    aAtk: {type: Number, default: 0},
    double: {type: Number, default: 0},
    skill: {type: Number, default: 0},
    exp: {type: Number, default: 0},
    level: {type: Number, default: 1},
    maxExp: {type: Number, default: 100},
    type: Number,
    isBoss: {type: Boolean, default: false}
});

HeroListSchema.statics.findHeroesByUserId = function (id, callback) {
    this.find({_fk: id}, callback);
};
HeroListSchema.statics.findHeroByUser = function (userId, heroId, callback) {
    this.findOne({id: heroId, _fk: userId}, callback);
};

var HeroList = mongoose.model('HeroList', HeroListSchema, 'heroList');

HeroList.close = function () {
    mongoose.close();
};

module.exports.HeroList = HeroList;
