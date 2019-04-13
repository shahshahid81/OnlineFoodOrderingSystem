const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const moment = require('moment');

const router  = express.Router();

const Food = require("../models/food");
const User = require("../models/user");
const Message = require("../models/message");
const middleware = require('../middleware/middleware');

var savedItems = [];

router.get('/',function(req,res){
	res.render('user/index');
});

router.get('/menu',function(req,res){
	Food.find({},function(err,allFoods){
		if(err){
			console.log(err);
		} else {
			if( typeof req.user !== 'undefined'){
				var currentUser = savedItems.find(function(element){
					return element.user === req.user.username;
				});
			}
			if(typeof currentUser !== 'undefined'){
				res.render("user/menu",{Foods:allFoods,cartItems:currentUser.cart});
			} else {
				res.render('user/menu',{Foods:allFoods,cartItems:{}});
			}
		}
	});
});

router.get('/contactus',function(req,res){
	res.render('user/contact-us');
});

router.post('/contactus',function(req,res){
	var messageObject = {
		name : req.body.name,
		phoneNumber : req.body['phone-number'],
		email : req.body.email,
		message : req.body.message
	};

	Message.insertMany(messageObject,function(err,doc){
		if(err){
			console.log(err);
			req.flash('error','An error occured.');
			res.redirect('/contactus');			
		} else {
			req.flash('success','Message Submitted Successfully.');
			res.redirect('/contactus');			
		}
	});
});

router.get('/signup',function(req,res){
	res.render("user/signup");
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
			if(err.name === 'UserExistsError'){
				req.flash('error',err.message);
			}
			else {
				req.flash('error','An error occured.');
			}
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
	res.render('user/signin');
});

router.post('/signin',
passport.authenticate("local",{
	successRedirect : '/menu',
	failureRedirect : "/signin",
	failureFlash : true
}));

router.get('/cart',middleware.isLoggedIn,function(req,res){
	currentItems = savedItems.find(function(element){
		return element.user === req.user.username
	});
	if(typeof currentItems !== 'undefined'){
		res.render('user/cart',{cartItems:currentItems.cart});
	} else {
		res.render('user/cart',{});
	}
});

router.post('/cart',middleware.isLoggedIn,function(req,res){

	if(savedItems.find(function(element){
		return element.user === req.user.username;
	}) === undefined){
		savedItems.push({user : req.user.username});
	}

	var removeItem = req.get('removeItem');
	var clearCart = req.get('clearCart');
	
	if(removeItem === 'true'){
		var items = req.query.items;

		var userObject = savedItems.find(function(element){
			return element.user === req.user.username;
		});


		var itemIndex = userObject.cart.findIndex(function(element){
			return element.Name === items;
		});

		userObject.cart.splice(itemIndex,1);

		for(var i=0;i<savedItems.length;i++){
			if(savedItems[i].user === userObject.user){
				savedItems[i].cart = userObject.cart;
				break;
			}
		}

		res.sendStatus(200);
	} else if (clearCart === 'true') {

		var userObject = savedItems.find(function(element){
			return element.user === req.user.username;
		});

		if(typeof userObject.cart !== 'undefined'){
			userObject.cart = [];
		}

		res.sendStatus(200);
		
	}else {
		var items = req.query.items;

		var cartItems = new Promise(function(resolve,reject){
			Food.findOne({Name : items},function(err,item){
				if(err){
					reject(err);
				}
				resolve(item);
			});
		});
	
		cartItems.then(function(foundItems){

			var user = savedItems.find(function(element){
				return element.user === req.user.username;
			});

			if( typeof user.cart === 'undefined'){
				user.cart = [];
				user.cart.push(foundItems);
				res.sendStatus(200);
			} else {
				if(user.cart.length === 0 ){
					user.cart = [];
					user.cart.push(foundItems);
				} else {
					var index = user.cart.findIndex(function(element){
						return element.Name === foundItems.Name;
					});
		
					if(index === -1){
						user.cart.push(foundItems);
					}
				}
				res.sendStatus(200);
			}

		}).catch(function(error){
			console.log(error);
		});
	}

});

router.get('/signout', function(req, res){
	req.logout();
	res.redirect('/menu');
});

router.get('/change-password',middleware.isLoggedIn,function(req,res){

	User.findOne({username:req.user.username},function(err,foundUser){
		if(err){
			console.log(err);
		} else {
			res.render('user/change-password',{User:foundUser});
		}
	});
});

router.post('/change-password',middleware.isLoggedIn,function(req,res){

	User.findOne({username:req.user.username},function(err,foundUser){
		if(err){
			console.log(err);
		} else {
			foundUser.setPassword(req.body['new-password'],function(){
				foundUser.save();
				req.flash('success','Data updated successfully');
				res.redirect('/change-password');
			});
		}
	});

});

router.get('/update-profile',middleware.isLoggedIn,function(req,res){

	User.findOne({username:req.user.username},function(err,foundUser){
		if(err){
			console.log(err);
		} else {
			res.render('user/update-profile.ejs',{User:foundUser});
		}
	});
});

router.post('/update-profile',middleware.isLoggedIn,function(req,res){

	User.findOne({username:req.user.username},function(err,foundUser){
		if(err){
			console.log(err);
		} else {
			var name = req.body.name || foundUser.name;
			var username = req.body.email || foundUser.username;
			var phoneNumber = req.body['phone-number'] || foundUser.phoneNumber; 

			var updatedUser = {
				name ,
				phoneNumber ,
				username
			}		
			User.findOneAndUpdate({_id : foundUser._id},updatedUser,{new : true},function(err,modifiedUser){
				if(err){
					console.log(err);
					req.flash('error','Error while updating data');
					res.redirect('/update-profile');
				} else {
					req.flash('success','Data updated successfully');
					res.redirect('/update-profile');
				}
			});
		}
	});

});

router.post('/order',middleware.isLoggedIn,function(req,res){

	var orderItems = JSON.parse(req.query.items);

	var savedUser = savedItems.find(function(element){
		return element.user === req.user.username;
	});

	if(typeof savedUser === 'undefined' || typeof orderItems === 'undefined'){
		req.flash('error','Please Enter items in the cart');
		res.redirect('/menu');
	} else if(typeof orderItems.items === 'undefined'){
		req.flash('error','Please Enter items in the cart');
		res.redirect('/menu');		
	} else if( orderItems.items.length === 0){
		req.flash('error','Please Enter items in the cart');
		res.redirect('/menu');
	}else {
		var orderItemsPromises = orderItems.items.map(function(current){
			return new Promise(function(resolve,reject){
				Food.findOne({Name:current.name},function(err,item){
					if(err){
						reject(err);
					}
					resolve([item,current.quantity]);
				});
			});
		});

		Promise.all(orderItemsPromises).then(function(foundItems){
			var savedOrder = {};
			savedOrder.items = [];
			foundItems.forEach(function(current){
				var item = {};
				item.product_id = current[0]._id;
				item.quantity = current[1],
				item.price = (parseInt(current[1])*parseInt(current[0].Price)).toString();
				savedOrder.items.push(item);
			});
			savedOrder.grandTotal = orderItems.total;
			savedUser.order = savedOrder;
			User.findOne({username:savedUser.user},function(err,foundUser){
				if(err){
					console.log(err);
				} else {
					res.render('user/order',{User:foundUser});
				}
			});
		}).catch(function(err){
			console.log(err);
		});

	}

});

router.get('/order',middleware.isLoggedIn,function(req,res){

	User.aggregate([
		{$match : {	username:req.user.username	}},
		{$project : {orders : 1,_id : 0}},
		{$unwind : "$orders" },
		{$sort : {"orders.orderedAt" : -1}}
	]).exec(function(err,foundDoc){
		if(err){
			console.log(err);
		} else {
			res.render('user/orders',{orderArr:foundDoc,moment:moment});
		}
	});
});

router.get('/order/:id',middleware.isLoggedIn,function(req,res){
	User.findOne({'orders.order_id':req.params.id},function(err,foundDoc){
		if(err){
			console.log(err);
		} else {
			var order = foundDoc.orders.find(function(element){
				return element.order_id.toString() === req.params.id;
			});
			var productPromises = order.items.map(function(current){
				return new Promise(function(resolve,reject){
					Food.findById(current.product_id,{Description : 0,Category : 0},function(err,foundDoc){
						if(err){
							reject(err);
						} else {
							resolve({item:foundDoc,quantity : current.quantity});
						}
					});
				});
			});

			Promise.all(productPromises).then(function(items){
				var grandTotal = 0;
				items.forEach(function(current){
					grandTotal+=parseInt(current.item.Price)*(current.quantity);
				});
				res.render('user/order-item',{items:items,grandTotal:grandTotal});
			}).catch(function(err){
				console.log(err);
			});
		}
	});
});

router.post('/checkout',middleware.isLoggedIn,function(req,res){
	var address = {
		apartment : req.body.apartment,
		street : req.body.street,
		city : req.body.city,
		pincode : req.body.pincode
	};

	var savedUser = savedItems.find(function(element){
		return element.user === req.user.username;
	});

	if(typeof savedUser === 'undefined' || typeof address === 'undefined'){
		req.flash('error','Please Enter items in the cart');
		res.redirect('/menu');
	} else if(typeof savedUser.order === 'undefined'){
		req.flash('error','Please Enter items in the cart');
		res.redirect('/menu');		
	} else if(typeof savedUser.order.items === 'undefined'){
		req.flash('error','Please Enter items in the cart');
		res.redirect('/menu');		
	} else if(savedUser.order.items.length === 0){
		req.flash('error','Please Enter items in the cart');
		res.redirect('/menu');				
	} else {
		savedUser.order.address = address;
		order = savedUser.order;
		order.order_id = mongoose.mongo.ObjectId();
		order.orderedAt = moment().toDate();
		order.status = 'Pending';
		User.findOneAndUpdate({username : savedUser.user},{$push:{orders : order}},function(err,foundDoc){
			if(err){
				console.log(err);
			} else {
				savedUser.cart = "";
				savedUser.order = "";
				res.render('user/checkout',{orderID : order.order_id,amount : order.grandTotal});
			}
		});
	}

});

module.exports = router;