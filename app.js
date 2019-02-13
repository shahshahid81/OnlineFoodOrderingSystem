const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Food = require("./models/food");
const User = require("./models/user");

const app = express();

const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/foodDB",{ useNewUrlParser:true },function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log('connected');
	}
});

app.use(cookieParser());
app.use(session({
	cookie: { maxAge: 60000 },
	resave:false,
	saveUninitialized:false,
	secret : 'secret'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// passport.use(new LocalStrategy(User.authenticate()));


// passport.serializeUser(function(user, done) {
// 	done(null, user.id);
// });
  
// passport.deserializeUser(function(id, done) {
// 	User.findById(id, function(err, user) {
// 		done(err, user);
// 	});
// });

// passport.use(new LocalStrategy(function(username, password, done) {
// 	User.findOne({ username: username }, function (err, user) {
// 	if (err) { return done(err); }
// 	if (!user) {
// 		return done(null, false, { message: 'Incorrect username.' });
// 	}
// 	if (!user.validPassword(password)) {
// 		return done(null, false, { message: 'Incorrect password.' });
// 	}
// 	return done(null, user);
// 	});
// }
// ));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new LocalStrategy({
// 	usernameField : 'email'
// },function(username, password, done) {
// 	User.findOne({ username : username }, function (err, user) {
// 	if (err) {	return done(err); }
// 	if (!user) {
// 		return done(null, false, { message: 'Incorrect username.' });
// 	}
// 	if (!user.validPassword(password)) {
// 		return done(null, false, { message: 'Incorrect password.' });
// 	}
// 	return done(null, user);
// 	});
// }
// ));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});

app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');

app.get('/',function(req,res){
	res.render('index');
});

app.get('/menu',function(req,res){
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

app.get('/signup',function(req,res){
	res.render("signup");
});

app.post('/signup',function(req,res,next){
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

app.get('/signin',function(req,res){
	res.render('signin');
});

// app.post('/signin',
//   passport.authenticate('local'),
//   function(req, res) {
// 	console.log(req.user)
//     res.redirect('/menu');
//   });

app.post('/signin',
	passport.authenticate("local",{
		successRedirect : '/menu',
		failureRedirect : "/signin",
		failureFlash : true
}));

// app.post('/signin',function(req,res){
// 	// passport.authenticate('local',function(err, user, info){
// 	// 	// console.log(err);
// 	// 	// console.log(user);
// 	// 	console.log(info);
// 	// 	next();
// 	// })(req,res,next);
// 	User.findOne({EmailAddress : 'shahshahid81@gmail.com'},function(err,user){
// 		if(err){
// 			console.log(err);
// 		}
// 		console.log(user);
// 	});
// });

// app.post('/signin',function (req, res, next) {
//     passport.authenticate('local', function (error, user, info) {
//       console.log(error);
//       console.log(user);
//       console.log(info);

//       if (error) {
//         res.status(401).send(error);
//       } else if (!user) {
//         res.status(401).send(info);
//       } else {
//         next();
//       }

//       res.status(401).send(info);
//     })(req, res,next);
//   },
//   function (req, res) {
//     res.status(200).send('logged in!');
// });

app.get('*',function(req,res){
	res.send("page not found");
});

app.listen(port,function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Server Started.....');
	}
});

