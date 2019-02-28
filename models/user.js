const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    phoneNumber : {
        type : String,
        required : true,
        minlength : 1,
        maxlength: 10,
        trim : true,
        unique: true
    },
    username : {
        type : String,
        required : true,
        unique:true,
        trim  : true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User",userSchema,'user');

