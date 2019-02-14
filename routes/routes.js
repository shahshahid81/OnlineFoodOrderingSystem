const express = require('express');
const passport = require('passport');

const router  = express.Router();

const Food = require("../models/food");
const User = require("../models/user");
const middleware = require('../middleware/middelware');


router.get('/',function(req,res){
	res.render('index');
});

router.get('/menu',function(req,res){
	var itemCategory = req.query.item;
	if(itemCategory){

		Food.find({Category:itemCategory},function(err,allFoods){
			if(err){
				console.log(err);
			}else{
				res.render("partials/menu-item",{Foods:allFoods});
			}
		});

	} else {

		Food.find({Category:"Chicken"},function(err,allFoods){
			if(err){
				console.log(err);
			}else{
				res.render("menu",{Foods:allFoods});
			}
		});
		
	}
});

router.get('/signup',function(req,res){
	res.render("signup");
});

router.post('/signup',function(req,res,next){
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
				return res.redirect('/menu');
			  });
		}
		
	});
});

router.get('/signin',function(req,res){
	res.render('signin');
});

router.post('/signin',
	passport.authenticate("local",{
		successRedirect : '/menu',
		failureRedirect : "/signin",
		failureFlash : true
}));

router.get('/cart',middleware.isLoggedIn,function(req,res){
    res.send('cart');
});


router.get('/signout', function(req, res){
	req.logout();
  res.redirect('/menu');
});

router.get('*',function(req,res){
	res.send("page not found");
});

module.exports = router;