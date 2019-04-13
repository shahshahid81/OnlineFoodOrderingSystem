const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
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
    },
    email : {
        type : String,
        required : true,
        trim  : true
    },
    message : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    }
});

module.exports =  mongoose.model("Message",messageSchema,'message');

