const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');

// app.get('/',function(req,res){
// 	res.sendFile(path.join(__dirname,'public/index.html'));
// });

// app.get('/cart',function(req,res){
// 	res.sendFile(path.join(__dirname,'public/cart.html'));
// });

// app.get('/order',function(req,res){
// 	res.sendFile(path.join(__dirname,'public/order.html'));
// });

app.get('/',function(req,res){
	res.render('index');
});

app.get('/menu',function(req,res){
	res.render('menu');
});

app.listen(4000,function(){
	console.log('Server Started.....');
});
