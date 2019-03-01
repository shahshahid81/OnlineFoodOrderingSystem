const express = require('express');
const passport = require('passport');

const router  = express.Router();

const Food = require("../models/food");
const User = require("../models/user");
const middleware = require('../middleware/middleware');

var savedItems = [];

router.get('/',function(req,res){
	res.render('index');
});

router.get('/menu',function(req,res){

	var itemCategory = req.query.item;
	var visited = req.get('visited');

	if(!itemCategory){
		Food.find({Category:"Chicken"},function(err,allFoods){
			if(err){
			console.log(err);
			}else{
				if( typeof req.user !== 'undefined'){
				var currentUser = savedItems.find(function(element){
						return element.user === req.user.username;
					});
				}
				if(typeof currentUser !== 'undefined'){
					res.render("menu",{Foods:allFoods,cartItems:currentUser.cart});
				} else {
					res.render('menu',{Foods:allFoods,cartItems:{}});
				}
			}
		});
	} else if(itemCategory && visited === 'true') {
		Food.find({Category:itemCategory},function(err,allFoods){
			if(err){
				console.log(err);
			}else{
				if( typeof req.user !== 'undefined'){
					var currentUser = savedItems.find(function(element){
						return element.user === req.user.username;
					});
				}
				if(typeof currentUser !== 'undefined'){
					res.render("partials/menu-item",{Foods:allFoods,cartItems:currentUser.cart});
				} else {
					res.render('partials/menu-item',{Foods:allFoods,cartItems:{}});
				}
			}
		});
	} else if(itemCategory && visited !== 'true'){
		//for proper reload
		Food.find({Category : itemCategory},function(err,allFoods){
			if(err){
				console.log(err);
			} else {
				// var currentUser = savedItems.find(function(element){
				// 	return element.user === req.user.username;
				// });
				if( typeof req.user !== 'undefined'){
					var currentUser = savedItems.find(function(element){
						return element.user === req.user.username;
					});
				}
				if(typeof currentUser !== 'undefined'){				
					res.render("menu",{Foods:allFoods,cartItems:currentUser.cart});
				} else {
					res.render('menu',{Foods:allFoods,cartItems:{}});
				}
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
	currentItems = savedItems.find(function(element){
		return element.user === req.user.username
	});
	if(typeof currentItems !== 'undefined'){
		res.render('cart',{cartItems:currentItems.cart});
	} else {
		res.render('cart',{});
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
			}

			var index = user.cart.findIndex(function(element){
				return element.Name === foundItems.Name;
			});

			if(index === -1){
				user.cart.push(foundItems);
			}
			res.sendStatus(200);
		}).catch(function(error){
			console.log(error);
		});
	}

});

router.get('/signout', function(req, res){
	req.logout();
	res.redirect('/menu');
});

router.get('/profile',middleware.isLoggedIn,function(req,res){

	User.findOne({username:req.user.username},function(err,foundUser){
		if(err){
			console.log(err);
		} else {
			res.render('profile',{User:foundUser});
		}
	});
});

router.post('/profile',middleware.isLoggedIn,function(req,res){

	User.findOne({username:req.user.username},function(err,foundUser){
		if(err){
			console.log(err);
		} else {
			var name = req.body.name || foundUser.name;
			var username = req.body.email || foundUser.username;
			var phoneNumber = req.body['phone-number'] || foundUser.phoneNumber; 

			// console.log(req.body.name);
			// console.log(req.body.username);
			// console.log(req.body.phoneNumber);

			// console.log('=======================');

			// console.log(foundUser.name);
			// console.log(foundUser.username);
			// console.log(foundUser.phoneNumber);

			var updatedUser = {
				name ,
				phoneNumber ,
				username
			}		
			User.findOneAndUpdate({_id : foundUser._id},updatedUser,{new : true},function(err,modifiedUser){
				if(err){
					console.log(err);
					req.flash('error','Error while updating data');
					res.redirect('/profile');
				} else {
					modifiedUser.setPassword(req.body['new-password'],function(){
						modifiedUser.save();
						req.flash('success','Data updated successfully');
						res.redirect('/profile');
					});
				}
			});
		}
	});

});

// router.get('/order',middleware.isLoggedIn,function(req,res){

// 	// console.log(JSON.parse(req.query.items));
// 	// console.log(JSON.parse(req.query.items).total);

// 	var savedUser = savedItems.find(function(element){
// 		return element.user === req.user.username;
// 	});

// 	// console.log(savedUser);

// 	if(typeof savedUser === 'undefined'){	
// 		req.flash('error','Please Enter Items in the cart');
// 		res.redirect('/menu');
// 	} else if(typeof savedUser.cart === 'undefined' || savedUser.cart.length === 0){	
// 		req.flash('error','Please Enter Items in the cart');
// 		res.redirect('/menu');
// 	} else {
// 		User.findOne({username:savedUser.user},function(err,foundUser){
// 			if(err){
// 				console.log(err);
// 			} else {
// 				res.render('order',{User:foundUser});
// 			}
// 		});
// 	}
// });

// router.post('/order',middleware.isLoggedIn,function(req,res){
// 	console.log(JSON.parse(req.query.items));
// 	console.log(JSON.parse(req.query.items).total);
// 	res.send('order');
// });


router.post('/order',middleware.isLoggedIn,function(req,res){

	// // console.log(JSON.parse(req.query.items));
	// // console.log(JSON.parse(req.query.items).total);

	// var savedUser = savedItems.find(function(element){
	// 	return element.user === req.user.username;
	// });

	// // console.log(savedUser);

	// if(typeof savedUser === 'undefined'){	
	// 	req.flash('error','Please Enter Items in the cart');
	// 	res.redirect('/menu');
	// } else if(typeof savedUser.cart === 'undefined' || savedUser.cart.length === 0){	
	// 	req.flash('error','Please Enter Items in the cart');
	// 	res.redirect('/menu');
	// } else {
	// 	User.findOne({username:savedUser.user},function(err,foundUser){
	// 		if(err){
	// 			console.log(err);
	// 		} else {
	// 			res.render('order',{User:foundUser});
	// 		}
	// 	});
	// }

	var orderItems = JSON.parse(req.query.items);
	var savedOrderItems = {};

	var savedUser = savedItems.find(function(element){
		return element.user === req.user.username;
	});

	// console.log(orderItems);
	// console.log("\n\n"+savedUser);

	if(typeof savedUser === 'undefined' || typeof orderItems === 'undefined'){
		req.flash('error','Please Enter items in the cart');
		res.redirect('/menu');
	} else if(typeof orderItems.items === 'undefined' || orderItems.items.length === 0){
		req.flash('error','Please Enter items in the cart');
		res.redirect('/menu');		
	} else {
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
			foundItems.forEach(function(current){
				// console.log(current);
				console.log([current[0]._id,current[1],parseInt(current[1])*parseInt(current[0].Price)]);
				// var arr = [current[0]._id,current[1]];
			});
			// console.log(foundItems);
		}).catch(function(err){
			console.log(err);
		});

		// var cartItems = items.map(function(current){
		// 	return new Promise(function(resolve,reject){
		// 		Food.findOne({Name : current},function(err,item){
		// 			if(err){
		// 				reject();
		// 			}
		// 			resolve(item);
		// 		});
		// 	});
		// });
	
		// Promise.all(cartItems)
		// .then(function(foundItems){
		// 	savedItems = [...new Set(foundItems)];
		// 	res.sendStatus(200);
		// 	// console.log(savedItems);
		// });
	}

});

router.get('/order',middleware.isLoggedIn,function(req,res){
	res.send('GET previous orders');
});

router.get('*',function(req,res){
	res.send("page not found");
});

module.exports = router;