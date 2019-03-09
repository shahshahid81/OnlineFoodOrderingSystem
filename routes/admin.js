const express = require('express');
const moment = require('moment');

const router = express.Router();

const User = require('../models/user');

router.get('/',function(req,res){
    User.find({},function(err,foundDocs){
        // console.log(foundDocs);

        var allOrders = [];
        foundDocs.forEach(function(current){
            current.orders.forEach(function(order){
                allOrders.push({
                    username : current.username,
                    order_id: order.order_id,
                    orderedAt : order.orderedAt,
                    total : order.grandTotal,
                    status : order.status
                });
            });
        });
        // console.log(allOrders);
        // res.render('admin',{orders:{}});
        res.render('admin',{orders:allOrders,moment:moment});
    });
});

router.get('/user/new',function(req,res){
    res.render('new-user');
});

router.post('/user/new',function(req,res){
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
			return res.redirect("/signup");
		} else {
			req.login(user, function(err) {
                if (err) { return next(err); }
                req.flash('success','User added Successfully');
				return res.redirect('/admin/user/new');
			  });
		}
		
	});
    // res.render('new-user');
});

router.get('/user',function(req,res){
    User.find({},{orders : 0},function(err,foundDocs){
        if(err){
            console.log(err);
        } else {
            // console.log(foundDocs);
            res.render('view-user',{users : foundDocs});
        }
    });
});

router.post('/user/:id/delete',function(req,res){
    User.findByIdAndDelete(req.params.id,function(){
        req.flash('success','User Deleted Successfully');
        res.redirect('/admin/user');
    });
});

router.get('/user/:id/modify',function(req,res){
    User.findById(req.params.id,null,{orders:0},function(err,foundDoc){
        if(err){
            console.log(err);
        } else {
            // console.log(foundDoc);
            res.render('modify-user',{User:foundDoc});
        }
    })
});

router.post('/user/:id/modify',function(req,res){

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
            modifiedUser.setPassword(req.body['new-password'],function(){
                modifiedUser.save();
                req.flash('success','Data updated successfully');
                res.redirect('/admin/user');
            });
        }
    });

});

module.exports = router;