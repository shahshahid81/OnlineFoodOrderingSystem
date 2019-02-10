const mongoose = require('mongoose');
const validator = require('validator');

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
        validate : {
            validator : validator.isMobilePhone,
            message : '{Value} is not a valid phone number'
        }
    },
    EmailAddress : {
        type : String,
        required : true,
        unique:true,
        validate : {
            validator: validator.isEmail,
            message: '{Value} is not a valid email'
        }
    },
    Password : {
        type : String,
        required : true,
        minlength : 6,
        maxlength : 32,
        trim : true
    }
});

module.exports =  mongoose.model("User",userSchema,'user');

