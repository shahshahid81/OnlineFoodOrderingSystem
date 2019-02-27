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

// router.get('/menu',function(req,res){
// 	// console.log(req.session);
// 	var itemCategory = req.query.item;
// 	var visited = req.get('visited');

// 	if(!itemCategory){
// 		Food.find({Category:"Chicken"},function(err,allFoods){
// 			if(err){
// 			console.log(err);
// 			}else{
// 			res.render("menu",{Foods:allFoods,cartItems:savedItems});
// 			}
// 		});
// 	} else if(itemCategory && visited === 'true') {
// 		Food.find({Category:itemCategory},function(err,allFoods){
// 			if(err){
// 				console.log(err);
// 			}else{
// 				res.render("partials/menu-item",{Foods:allFoods,cartItems:savedItems});
// 			}
// 		});
// 	} else if(itemCategory && visited !== 'true'){
// 		Food.find({Category : itemCategory},function(err,allFoods){
// 			if(err){
// 				console.log(err);
// 			} else {
// 				res.render('menu',{Foods : allFoods,cartItems:savedItems});
// 			}
// 		});
// 	}
// });

// router.get('/menu',function(req,res){
// 	var itemCategory = req.query.item;
// 	var visited = req.get('visited');

// 	if(!itemCategory){
// 		Food.find({Category:"Chicken"},function(err,allFoods){
// 			if(err){
// 			console.log(err);
// 			}else{
// 			var currentUser = savedItems.find(function(element){
// 				return element.user === req.user.username;
// 			});
// 			console.log(currentUser);
// 			if(typeof currentUser === 'undefined'){
// 				console.log('above cart undefined');
// 				// console.log(currentUser.cart);
// 				res.render('menu',{Foods:allFoods,cartItems:{}});
// 			} else {
// 				console.log('above cart');
// 				console.log(currentUser.cart);
// 				res.render("menu",{Foods:allFoods,cartItems:currentUser.cart});
// 			}
// 			}
// 		});
// 	} else if(itemCategory && visited === 'true') {
// 		Food.find({Category:itemCategory},function(err,allFoods){
// 			if(err){
// 				console.log(err);
// 			}else{
// 				var currentUser = savedItems.find(function(element){
// 					return element.user === req.user.username;
// 				});
// 				console.log(currentUser);
// 				if(typeof currentUser.cart !== 'undefined'){
// 					console.log('above cart2');
// 					console.log(currentUser.cart);
// 					res.render("partials/menu-item",{Foods:allFoods,cartItems:currentUser.cart});
// 				} else {
// 					console.log('above cart2 undefined');
// 					console.log(currentUser.cart);
// 					res.render('partials/menu-item',{Foods:allFoods,cartItems:{}});
// 				}
// 			}
// 		});
// 	} else if(itemCategory && visited !== 'true'){
// 		//for proper reload
// 		Food.find({Category : itemCategory},function(err,allFoods){
// 			if(err){
// 				console.log(err);
// 			} else {
// 				var currentUser = savedItems.find(function(element){
// 					return element.user === req.user.username;
// 				});
// 				console.log(currentUser);
// 				if(typeof currentUser.cart !== 'undefined'){				
// 					console.log('above cart3');
// 					console.log(currentUser.cart);
// 					res.render("menu",{Foods:allFoods,cartItems:currentUser.cart});
// 				} else {
// 					console.log('above cart3 undefined');
// 					console.log(currentUser.cart);
// 					res.render('menu',{Foods:allFoods,cartItems:{}});
// 				}
// 			}
// 		});
// 	} 
// });

router.get('/menu',function(req,res){
	var itemCategory = req.query.item;
	// console.log(itemCategory);
	var visited = req.get('visited');
	// console.log(visited);

	if(!itemCategory){
		Food.find({Category:"Chicken"},function(err,allFoods){
			if(err){
			console.log(err);
			}else{
				var currentUser = savedItems.find(function(element){
					return element.user === req.user.username;
				});
				console.log(currentUser);
				if(typeof currentUser !== 'undefined'){
					console.log('above cart1');
					console.log(currentUser.cart);
					res.render("menu",{Foods:allFoods,cartItems:currentUser.cart});
				} else {
					console.log('above cart1 undefined');
					res.render('menu',{Foods:allFoods,cartItems:{}});
				}
			}
		});
	} else if(itemCategory && visited === 'true') {
		Food.find({Category:itemCategory},function(err,allFoods){
			if(err){
				console.log(err);
			}else{
				var currentUser = savedItems.find(function(element){
					return element.user === req.user.username;
				});
				console.log(currentUser);
				if(typeof currentUser !== 'undefined'){
					console.log('above cart2');
					// console.log(currentUser.cart);
					res.render("partials/menu-item",{Foods:allFoods,cartItems:currentUser.cart});
				} else {
					console.log('above cart2 undefined');
					// console.log(currentUser.cart);
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
				var currentUser = savedItems.find(function(element){
					return element.user === req.user.username;
				});
				// console.log(currentUser);
				if(typeof currentUser !== 'undefined'){				
					console.log('above cart3');
					console.log(currentUser.cart);
					res.render("menu",{Foods:allFoods,cartItems:currentUser.cart});
				} else {
					console.log('above cart3 undefined');
					// console.log(currentUser.cart);
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

// router.post('/cart',middleware.isLoggedIn,function(req,res){

// 	var items = JSON.parse(req.query.items);

// 	var cartItems = items.map(function(current){
// 		return new Promise(function(resolve,reject){
// 			Food.findOne({Name : current},function(err,item){
// 				if(err){
// 					reject();
// 				}
// 				resolve(item);
// 			});
// 		});
// 	});

// 	Promise.all(cartItems)
// 	.then(function(items){
// 		savedItems = items;
// 		res.render('cart', {cartItems : savedItems});
// 	});

// });
	
router.get('/cart',middleware.isLoggedIn,function(req,res){
	// res.render('cart',{cartItems:savedItems});
	currentItems = savedItems.find(function(element){
		return element.user === req.user.username
	});
	// console.log(currentItems);
	if(typeof currentItems !== 'undefined'){
		res.render('cart',{cartItems:currentItems.cart});
	} else {
		res.render('cart',{});
	}
});

// router.post('/cart',middleware.isLoggedIn,function(req,res){

// 	// console.log(savedItems);
// 	// console.log('------------------');
// 	var removeItem = req.get('removeItem');
	
// 	if(removeItem === 'true'){
// 		var items = req.query.items;
// 		var index = savedItems.indexOf(items);
// 		savedItems.splice(index,1);
// 		// console.log('removed item');
// 		// console.log(savedItems);
// 		res.sendStatus(200);
// 	} else {
// 		var items = JSON.parse(req.query.items);
// 		var cartItems = items.map(function(current){
// 			return new Promise(function(resolve,reject){
// 				Food.findOne({Name : current},function(err,item){
// 					if(err){
// 						reject();
// 					}
// 					resolve(item);
// 				});
// 			});
// 		});
	
// 		Promise.all(cartItems)
// 		.then(function(foundItems){
// 			savedItems = [...new Set(foundItems)];
// 			res.sendStatus(200);
// 			// console.log(savedItems);
// 		});
// 	}

// });

// router.post('/cart',middleware.isLoggedIn,function(req,res){

// 	// savedItems.push({user : req.session.passport.user});

// 	if(savedItems.find(function(element){
// 		return element.user === req.user.username;
// 	}) === undefined){
// 		savedItems.push({user : req.user.username});
// 	}

// 	// console.log(savedItems);
// 	// console.log('------------------');
// 	var removeItem = req.get('removeItem');
	
// 	if(removeItem === 'true'){
// 		var items = req.query.items;
// 		// var index = savedItems.indexOf(items);

// 		// console.log(items);

// 		var userObject = savedItems.find(function(element){
// 			return element.user === req.user.username;
// 		});

// 		// console.log('user:\n\n');
// 		// console.log(userObject);
// 		// console.log(userObject.cart);

// 		var itemIndex = userObject.cart.findIndex(function(element){
// 			return element.Name === items;
// 		});

// 		// console.log(itemIndex);
// 		// savedItems.splice(itemIndex,1);
// 		userObject.cart.splice(itemIndex,1);

// 		// console.log('before');
// 		// console.log('\n\n');		
// 		// console.log(userObject.cart);
// 		// console.log('\n\n');
// 		// console.log(savedItems);

// 		for(var i=0;i<savedItems.length;i++){
// 			if(savedItems[i].user === userObject.user){
// 				savedItems[i].cart = userObject.cart;
// 				break;
// 			}
// 		}

// 		// console.log('after');
// 		// console.log('\n\n');		
// 		// console.log(userObject.cart);
// 		// console.log('\n\n');
// 		// console.log(savedItems);

// 		console.log('removed item');
// 		// console.log(savedItems);
// 		res.sendStatus(200);
// 	} else {
// 		var items = JSON.parse(req.query.items);

// 		// savedItems.find(function(element){
// 		// 	return element.user === req.user.username;
// 		// }).cart = [...new Set(foundItems)];

// 		var cartItems = items.map(function(current){
// 			return new Promise(function(resolve,reject){
// 				Food.findOne({Name : current},function(err,item){
// 					if(err){
// 						reject();
// 					}
// 					resolve(item);
// 				});
// 			});
// 		});
	
// 		Promise.all(cartItems)
// 		.then(function(foundItems){
// 			// savedItems = [...new Set(foundItems)];

// 			// console.log(savedItems.find(function(element){
// 			// 	return element.user === req.session.passport.user;
// 			// }));
			
// 			savedItems.find(function(element){
// 				return element.user === req.user.username;
// 			}).cart = [...new Set(foundItems)];

// 			// console.log(foundItems);

// 			res.sendStatus(200);
// 			// console.log(savedItems);
// 		});
// 	}

// });

router.post('/cart',middleware.isLoggedIn,function(req,res){

	// savedItems.push({user : req.session.passport.user});

	if(savedItems.find(function(element){
		return element.user === req.user.username;
	}) === undefined){
		savedItems.push({user : req.user.username});
	}

	// console.log(savedItems);
	// console.log('------------------');
	var removeItem = req.get('removeItem');
	
	if(removeItem === 'true'){
		var items = req.query.items;
		// var index = savedItems.indexOf(items);

		// console.log(items);

		var userObject = savedItems.find(function(element){
			return element.user === req.user.username;
		});

		// console.log('user:\n\n');
		// console.log(userObject);
		// console.log(userObject.cart);

		var itemIndex = userObject.cart.findIndex(function(element){
			return element.Name === items;
		});

		// console.log(itemIndex);
		// savedItems.splice(itemIndex,1);
		userObject.cart.splice(itemIndex,1);

		// console.log('before');
		// console.log('\n\n');		
		// console.log(userObject.cart);
		// console.log('\n\n');
		// console.log(savedItems);

		for(var i=0;i<savedItems.length;i++){
			if(savedItems[i].user === userObject.user){
				savedItems[i].cart = userObject.cart;
				break;
			}
		}

		// console.log('after');
		// console.log('\n\n');		
		// console.log(userObject.cart);
		// console.log('\n\n');
		// console.log(savedItems);

		console.log('removed item');
		// console.log(savedItems);
		res.sendStatus(200);
	} else {
		var items = req.query.items;

		// savedItems.find(function(element){
		// 	return element.user === req.user.username;
		// }).cart = [...new Set(foundItems)];

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

		// console.log(items);

		var cartItems = new Promise(function(resolve,reject){
			Food.findOne({Name : items},function(err,item){
				if(err){
					reject(err);
				}
				resolve(item);
			});
		});
	
		cartItems.then(function(foundItems){
			// savedItems = [...new Set(foundItems)];

			// console.log(savedItems.find(function(element){
			// 	return element.user === req.session.passport.user;
			// }));
			// console.log(foundItems);
			var user = savedItems.find(function(element){
				return element.user === req.user.username;
			});
			console.log(user);
			if( typeof user.cart === 'undefined'){
				user.cart = [];
			}

			var index = user.cart.findIndex(function(element){
				return element.Name === foundItems.Name;
			});

			if(index === -1){
				user.cart.push(foundItems);
			}

			console.log(user);
			// console.log(new Set(...user.cart));
			// user.cart = [new Set(...user.cart)];
			// console.log(foundItems);
			// console.log(user);

			res.sendStatus(200);
			// console.log(savedItems);
		}).catch(function(error){
			console.log(error);
		});
	}

});

router.get('/signout', function(req, res){
	req.logout();
	res.redirect('/menu');
});

router.get('/profile',function(req,res){
	res.send('profile');
});

router.get('/order',function(req,res){
	res.send('order');
});


router.get('*',function(req,res){
	res.send("page not found");
});

module.exports = router;
