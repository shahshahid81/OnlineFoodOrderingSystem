const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    Name : {
        type : String,
        required : true,
        minlength : 1,
        trim : true,
        unique : true
    },
    Description : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    Price : {
        type : Number,
        required : true,
        minlength : 1,
        trim : true
    },
    Category : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    ImagePath : {
        type : String,
        required : true
    }
});

module.exports =  mongoose.model("Food",foodSchema,'food');

