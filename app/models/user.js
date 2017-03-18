var mongoose                = require('mongoose');
var Schema                  = mongoose.Schema;
var passportlocalmongoose   = require('passport-local-mongoose');

var UserSchema = new Schema({
    username : String,
    password : String,
    role     : {
        type    : String,
        default : 'User'
    },
    jwt     : {
        type    : String,
        default : ''
    }
});

UserSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model('User', UserSchema);
