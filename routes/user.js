const express = require('express');

const router = express.Router();

const User = require('../models/user');
const middleware = require('../middleware/middleware');

router.get('/new',middleware.isAdminLoggedIn,function(req,res){
    res.render('admin/new-user');
});

router.post('/new',middleware.isAdminLoggedIn,async function(req,res){
    const Password = req.body.password;
	const newUser = {
		name : req.body.name,
		phoneNumber : req.body['phone-number'],
		username : req.body.email
	};

    try {
        await User.register(newUser , Password);
        req.flash('success','User added Successfully');
        return res.redirect('/admin/user/new');
    } catch(error) {
        console.log(err);
        req.flash('error','An error occured');
        return res.redirect("/admin/user/new");
    }
	
});

router.get('/',middleware.isAdminLoggedIn,async function(req,res){
    try {
        let users = await User.find({},{orders : 0}).exec();
        res.render('admin/view-user',{users});
    } catch (error) {
        console.log(error);
    }
});

router.post('/:id/delete',middleware.isAdminLoggedIn,async function(req,res){
    try {
        await User.findByIdAndDelete(req.params.id).exec();
        req.flash('success','User Deleted Successfully');
        res.redirect('/admin/user');
    } catch (error) {
        console.log(error);
    }

});

router.get('/:id/modify',middleware.isAdminLoggedIn,async function(req,res){
    try {
        let user = await User.findById(req.params.id,null,{orders:0}).exec();
        res.render('admin/modify-user',{User:user});
    } catch(error) {
        console.log(error);
    }
});

router.post('/:id/modify',middleware.isAdminLoggedIn,async function(req,res){

    var updatedUser = {
        name:req.body.name,
        phoneNumber:req.body['phone-number'],
        username:req.body.email    
    };

    try {
        await User.findByIdAndUpdate(req.params.id,updatedUser,{new:true}).exec(); 
        req.flash('success','Data updated successfully');
        res.redirect('/admin/user');
    } catch(error) {
        console.log(error);
        req.flash('err','An error occured.');
        res.redirect('/admin/user');
    }

});

module.exports = router;