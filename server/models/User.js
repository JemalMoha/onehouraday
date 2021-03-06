const mongoose = require('mongoose');
const validator = require ('validator');
const bcrypt = require ('bcryptjs');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase:true,
        index: { unique: true },
        trim:true,
        validator:{
          validator:validator.isEmail,
          message:'{VALUE} is not a valid email'
        }
      },
      password: {
        type: String,
        required: true,
      },
});
UserSchema.pre('save',function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        if (err) {
          return next(err);
        }
        user.password=hash;
        next();
      });
    });
  }else{
    return next();
  }
});
UserSchema.methods.comparePassword = function(password, cb) {  
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};
module.exports = mongoose.model('User', UserSchema);
