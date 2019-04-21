const express = require('express');
const path = require('path');
const moment = require('moment');
const multer = require('multer');
const passport = require('passport');

const router = express.Router();

const User = require('../models/user');
const Food = require('../models/food');
const Message = require("../models/message");
const middleware = require('../middleware/middleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../public/img/Food/'));
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name.toUpperCase()+'.jpg');
    }
});

const upload = multer({ storage: storage });

router.get('/login',function(req,res){
    res.render('admin/login');
});

router.post('/login',
    passport.authenticate('admin-local',{
        successRedirect : '/admin',
        failureRedirect : "/admin/login",
        failureFlash : true
    }
));

router.get('/',middleware.isAdminLoggedIn,function(req,res){
    User.find({},function(err,foundUsers){
        if(err){
            console.log(err);
        } else {
            var userCount = foundUsers.length;
            var orderCount=0;
            var totalSales = 0;
            foundUsers.forEach(function(user){
                orderCount += user.orders.length;
                user.orders.forEach(function(order){
                    totalSales += parseInt(order.grandTotal);
                });
            });
            var statsObject = {
                user : userCount,
                order : orderCount,
                sales : totalSales
            };
            Message.find({},function(err,docs){
                res.render('admin/dashboard',{stats : statsObject,messages : docs});
            });
        }
    });
});

router.get('/order',middleware.isAdminLoggedIn,function(req,res){

    User.aggregate([
		{$unwind : "$orders" },
		{$sort : {"orders.orderedAt" : -1}}
	]).exec(function(err,foundDocs){

        var allOrders = [];
        foundDocs.forEach(function(current){
            allOrders.push({
                username : current.username,
                order_id: current.orders.order_id,
                orderedAt : current.orders.orderedAt,
                total : current.orders.grandTotal,
                status : current.orders.status
            });
        });
        res.render('admin/order-status',{orders:allOrders,moment:moment});
	});
});

router.post('/order/:id',middleware.isAdminLoggedIn,function(req,res){
    User.findOne({'orders.order_id' : req.params.id },{orders:1},function(err,doc){
        if(err){
            console.log(err);
        } else {
            var order = doc.orders.find(function(current){
                return current.order_id == req.params.id;
            });
            
            order.status = req.body.category;
            
            doc.save(function(err,modifiedDoc){
                if(err){
                    console.log(err);
                } else {
                    res.send(order.status);
                }
            });
        }
    });
});

router.get('/user/new',middleware.isAdminLoggedIn,function(req,res){
    res.render('admin/new-user');
});

router.post('/user/new',middleware.isAdminLoggedIn,function(req,res){
    const Password = req.body.password;
	const newUser = {
		name : req.body.name,
		phoneNumber : req.body['phone-number'],
		username : req.body.email
	};

	User.register(newUser , Password , function(err,user){
		if(err){
			console.log(err);
			req.flash('error','An error occured');
			return res.redirect("/admin/user/new");
		} else {
            req.flash('success','User added Successfully');
            return res.redirect('/admin/user/new');
		}
		
	});
});

router.get('/user',middleware.isAdminLoggedIn,function(req,res){
    User.find({},{orders : 0},function(err,foundDocs){
        if(err){
            console.log(err);
        } else {
            res.render('admin/view-user',{users : foundDocs});
        }
    });
});

router.post('/user/:id/delete',middleware.isAdminLoggedIn,function(req,res){
    User.findByIdAndDelete(req.params.id,function(){
        req.flash('success','User Deleted Successfully');
        res.redirect('/admin/user');
    });
});

router.get('/user/:id/modify',middleware.isAdminLoggedIn,function(req,res){
    User.findById(req.params.id,null,{orders:0},function(err,foundDoc){
        if(err){
            console.log(err);
        } else {
            res.render('admin/modify-user',{User:foundDoc});
        }
    })
});

router.post('/user/:id/modify',middleware.isAdminLoggedIn,function(req,res){

    var updatedUser = {
        name:req.body.name,
        phoneNumber:req.body['phone-number'],
        username:req.body.email    
    };

    User.findByIdAndUpdate(req.params.id,updatedUser,{new:true},function(err,modifiedUser){
        if(err){
            console.log(err);
            req.flash('err','An error occured.');
            res.redirect('/admin/user');
        } else {
            req.flash('success','Data updated successfully');
            res.redirect('/admin/user');
            // modifiedUser.setPassword(req.body['new-password'],function(){
            //     req.flash('success','Data updated successfully');
            //     res.redirect('/admin/user');
            //     modifiedUser.save();
            // });
        }
    });

});

router.get('/food',middleware.isAdminLoggedIn,function(req,res){
    Food.find({},{Description : 0,ImagePath : 0},function(err,foundDocs){
        if(err){
            console.log(err);
        } else {
            res.render('admin/view-food',{food:foundDocs});
        }
    });
}); 

router.post('/food/:id/delete',middleware.isAdminLoggedIn,function(req,res){
    Food.findByIdAndDelete(req.params.id,function(){
        req.flash('success','Food Item Deleted Successfully');
        res.redirect('/admin/food');
    });
});

router.get('/food/:id/modify',middleware.isAdminLoggedIn,function(req,res){
    Food.findById(req.params.id,function(err,foundDoc){
        if(err){
            console.log(err);
        } else {
            res.render('admin/modify-food',{Food:foundDoc});
        }
    })
});

router.post('/food/:id/modify',middleware.isAdminLoggedIn,upload.single('image'),function(req,res){

    var updatedFoodItem = {
        Name : req.body.name,
        Price : req.body.price,
        Category : req.body.category,
        Description : req.body.description
    };

    if(typeof req.file !== 'undefined'){
        updatedFoodItem.ImagePath = path.join('/img/Food',(req.body.name).toString().toUpperCase())+'.jpg'; 
    }

    Food.findByIdAndUpdate(req.params.id,updatedFoodItem,{new:true},function(err,modifiedFood){
        if(err){
            console.log(err);
            req.flash('err','An error occured.');
            res.redirect('/admin/food');
        } else {
            req.flash('success','Data updated successfully');
            res.redirect('/admin/food');
        }
    });

});

router.get('/food/new',middleware.isAdminLoggedIn,function(req,res){
    res.render('admin/new-food');
});

router.post('/food/new',middleware.isAdminLoggedIn,upload.single('image'),function(req,res){

    var newFoodItem = {
        Name : req.body.name,
        Price : req.body.price,
        Category : req.body.category,
        ImagePath : path.join('/img/Food',(req.body.name).toString().toUpperCase())+'.jpg',
        Description : req.body.description
    };

    Food.insertMany(newFoodItem,function(err,doc){
        if(err){
            console.log(err);
            req.flash('err','An error occured.');
            res.redirect('/admin/food');
        } else {
            req.flash('success','Data Inserted successfully');
            res.redirect('/admin/food');
        }
    });
});

router.get('/temp',function(req,res){
    Food.find({},{Description : 0,ImagePath : 0},function(err,foundDocs){
        if(err){
            console.log(err);
        } else {
            res.render('admin/temp',{food:foundDocs});
        }
    });
});

module.exports = router;