const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    Name : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    PhoneNumber : {
        type : String,
        required : true,
        minlength : 1,
        maxlength: 10,
        trim : true,
        unique: true
    },
    EmailAddress : {
        type : String,
        required : true,
        unique:true
    }
});

userSchema.plugin(passportLocalMongoose,{usernameField : 'EmailAddress'});

module.exports =  mongoose.model("User",userSchema,'user');

