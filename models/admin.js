const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique:true,
        trim  : true
    }
});

adminSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("Admin",adminSchema,'admin');