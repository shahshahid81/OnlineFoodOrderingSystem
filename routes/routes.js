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
			var currentItems = savedItems.find(function(element){
				return element.user === req.user.username
			});
			console.log(currentItems);
			res.render("menu",{Foods:allFoods,cartItems:currentItems});
			}
		});
	} else if(itemCategory && visited === 'true') {
		Food.find({Category:itemCategory},function(err,allFoods){
			if(err){
				console.log(err);
			}else{
				var currentItems = savedItems.find(function(element){
					return element.user === req.user.username
				});
				console.log(currentItems);
				res.render("partials/menu-item",{Foods:allFoods,cartItems:currentItems});
			}
		});
	} else if(itemCategory && visited !== 'true'){
		Food.find({Category : itemCategory},function(err,allFoods){
			if(err){
				console.log(err);
			} else {
				var currentItems = savedItems.find(function(element){
					return element.user === req.user.username
				});
				console.log(currentItems);
				res.render('menu',{Foods : allFoods,cartItems:currentItems});
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
	console.log(currentItems);
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

		console.log('user:\n\n');
		console.log(userObject);
		console.log(userObject.cart);

		var itemIndex = userObject.cart.findIndex(function(element){
			return element.Name === items;
		});

		console.log(itemIndex);
		// savedItems.splice(itemIndex,1);
		userObject.cart.splice(itemIndex,1);

		console.log('before');
		console.log('\n\n');		
		console.log(userObject.cart);
		console.log('\n\n');
		console.log(savedItems);

		for(var i=0;i<savedItems.length;i++){
			if(savedItems[i].user === userObject.user){
				savedItems[i].cart = userObject.cart;
				break;
			}
		}

		console.log('after');
		console.log('\n\n');		
		console.log(userObject.cart);
		console.log('\n\n');
		console.log(savedItems);

		console.log('removed item');
		console.log(savedItems);
		res.sendStatus(200);
	} else {
		var items = JSON.parse(req.query.items);

		// savedItems.find(function(element){
		// 	return element.user === req.user.username;
		// }).cart = [...new Set(foundItems)];

		var cartItems = items.map(function(current){
			return new Promise(function(resolve,reject){
				Food.findOne({Name : current},function(err,item){
					if(err){
						reject();
					}
					resolve(item);
				});
			});
		});
	
		Promise.all(cartItems)
		.then(function(foundItems){
			// savedItems = [...new Set(foundItems)];

			// console.log(savedItems.find(function(element){
			// 	return element.user === req.session.passport.user;
			// }));
			
			savedItems.find(function(element){
				return element.user === req.user.username;
			}).cart = [...new Set(foundItems)];

			// console.log(foundItems);

			res.sendStatus(200);
			console.log(savedItems);
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