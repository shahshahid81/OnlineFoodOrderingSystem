const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const itemSchema = mongoose.Schema({
    product_id : {
        type : ObjectId,
        required : true
    },
    quantity : {
        type : String,
        required : true
    },
    price : {
        type : String,
        required : true
    }
},{_id : false});

const addressSchema = mongoose.Schema({
    apartment : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    street : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    city : {
        type : String,
        required : true,
        minlength : 1 ,
        trim : true
    },
    pincode : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    }
},{_id : false});

const orderSchema = mongoose.Schema({
    order_id : {
        type : ObjectId,
        required : true
    },
    items : [itemSchema],
    grandTotal : String,
    address : addressSchema,
    orderedAt : {
        type: Date,
        required : true
    },
    status : {
        type : String,
        required : true
    }
},{_id:false});

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
    },
    orders : [orderSchema]
});

userSchema.plugin(passportLocalMongoose);

// module.exports.User =  mongoose.model("User",userSchema,'user');
module.exports =  mongoose.model("User",userSchema,'user');

