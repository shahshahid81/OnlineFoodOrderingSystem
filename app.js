const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + "/public"));

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'public/index.html'));
});

app.get('/cart',function(req,res){
	res.sendFile(path.join(__dirname,'public/cart.html'));
});

app.get('/order',function(req,res){
	res.sendFile(path.join(__dirname,'public/order.html'));
});

app.listen(3000,function(){
	console.log('Server started');
});
