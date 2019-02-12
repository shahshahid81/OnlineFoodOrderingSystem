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
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(flash());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport.use(new LocalStrategy(User.authenticate()));

passport.use(new LocalStrategy({
    usernameField: User.EmailAddress,
  },
	function(username, password, done) {
	  User.findOne({  }, function (err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		if (!user.verifyPassword(password)) { return done(null, false); }
		return done(null, user);
	  });
	}
  ));


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
		Name : req.body.name,
		EmailAddress : req.body.email,
		PhoneNumber : req.body['phone-number']
	};

	User.register(newUser , Password , function(err,user){
		if(err){
			console.log(err);
			req.flash('error','An error occured');
			return res.redirect("/signup");
		}
		
		next();
	});

},passport.authenticate('local',{
	successRedirect : '/menu',
	failureRedirect : '/signin'
}));

app.get('/signin',function(req,res){
	res.render('signin');
});

app.post('/signin',
	passport.authenticate("local",{
		successRedirect : '/menu',
		failureRedirect : "/signin"
}));

// app.post('/signin',
//   function (req, res, next) {
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
//     })(req, res);
//   },

//   function (req, res) {
//     res.status(200).send('logged in!');
//   });

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

