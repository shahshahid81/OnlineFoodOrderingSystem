const express = require('express');

const router = express.Router();

const User = require('../models/user');
const middleware = require('../middleware/middleware');

router.get('/new',middleware.isAdminLoggedIn,function(req,res){
    res.render('admin/new-user');
});

router.post('/new',middleware.isAdminLoggedIn,function(req,res){
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

router.get('/',middleware.isAdminLoggedIn,function(req,res){
    User.find({},{orders : 0},function(err,foundDocs){
        if(err){
            console.log(err);
        } else {
            res.render('admin/view-user',{users : foundDocs});
        }
    });
});

router.post('/:id/delete',middleware.isAdminLoggedIn,function(req,res){
    User.findByIdAndDelete(req.params.id,function(){
        req.flash('success','User Deleted Successfully');
        res.redirect('/admin/user');
    });
});

router.get('/:id/modify',middleware.isAdminLoggedIn,function(req,res){
    User.findById(req.params.id,null,{orders:0},function(err,foundDoc){
        if(err){
            console.log(err);
        } else {
            res.render('admin/modify-user',{User:foundDoc});
        }
    })
});

router.post('/:id/modify',middleware.isAdminLoggedIn,function(req,res){

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
        }
    });

});

module.exports = router;
