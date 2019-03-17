const express = require('express');
const path = require('path');
const moment = require('moment');
const multer = require('multer');

const router = express.Router();

const User = require('../models/user');
const Food = require('../models/food');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname,'../public/img/Food/'));
//     },
//     filename: function (req, file, cb) {
//         if(typeof req.body.image !== 'undefined'){
//             cb(null, req.body.name.toUpperCase()+'.jpg');
//         }
//     }
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../public/img/Food/'));
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name.toUpperCase()+'.jpg');
    }
});

const upload = multer({ storage: storage });

router.get('/',function(req,res){
    // User.find({},function(err,foundDocs){
    //     // console.log(foundDocs);

    //     var allOrders = [];
    //     foundDocs.forEach(function(current){
    //         current.orders.forEach(function(order){
    //             allOrders.push({
    //                 username : current.username,
    //                 order_id: order.order_id,
    //                 orderedAt : order.orderedAt,
    //                 total : order.grandTotal,
    //                 status : order.status
    //             });
    //         });
    //     });
    //     // console.log(allOrders);
    //     res.render('order-status',{orders:allOrders,moment:moment});
    // });

    User.aggregate([
		{$unwind : "$orders" },
		{$sort : {"orders.orderedAt" : -1}}
	]).exec(function(err,foundDocs){
		// console.log(foundDocs);

        var allOrders = [];
        foundDocs.forEach(function(current){
            allOrders.push({
                username : current.username,
                order_id: current.orders.order_id,
                orderedAt : current.orders.orderedAt,
                total : current.orders.grandTotal,
                status : current.orders.status
            });
        });
        // console.log(allOrders);
        res.render('order-status',{orders:allOrders,moment:moment});
	});
});

router.post('/:id',function(req,res){
    // res.send(req.body.category);
    User.findOne({'orders.order_id' : req.params.id },{orders:1},function(err,doc){
        if(err){
            console.log(err);
        } else {
            // console.log(doc);
            var order = doc.orders.find(function(current){
                return current.order_id == req.params.id;
            });
            // console.log(order);
            order.status = req.body.category;
            // console.log(order.status);
            // console.log(order);
            doc.save(function(err,modifiedDoc){
                if(err){
                    console.log(err);
                } else {
                    console.log(modifiedDoc);
                    res.redirect('/admin');
                }
            });
        }
    });
});

router.get('/user/new',function(req,res){
    res.render('new-user');
});

router.post('/user/new',function(req,res){
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
                req.flash('success','User added Successfully');
				return res.redirect('/admin/user/new');
			  });
		}
		
	});
    // res.render('new-user');
});

router.get('/user',function(req,res){
    User.find({},{orders : 0},function(err,foundDocs){
        if(err){
            console.log(err);
        } else {
            // console.log(foundDocs);
            res.render('view-user',{users : foundDocs});
        }
    });
});

router.post('/user/:id/delete',function(req,res){
    User.findByIdAndDelete(req.params.id,function(){
        req.flash('success','User Deleted Successfully');
        res.redirect('/admin/user');
    });
});

router.get('/user/:id/modify',function(req,res){
    User.findById(req.params.id,null,{orders:0},function(err,foundDoc){
        if(err){
            console.log(err);
        } else {
            // console.log(foundDoc);
            res.render('modify-user',{User:foundDoc});
        }
    })
});

router.post('/user/:id/modify',function(req,res){

    var updatedUser = {
        name:req.body.name,
        phoneNumber:req.body['phone-number'],
        username:req.body.email    
    };

    User.findByIdAndUpdate(req.params.id,updatedUser,{new:true},function(err,modifiedUser){
        if(err){
            console.log(err);
            req.flash('err','An error occured.');
            res.redirect('/admin/user');
        } else {
            modifiedUser.setPassword(req.body['new-password'],function(){
                modifiedUser.save();
                req.flash('success','Data updated successfully');
                res.redirect('/admin/user');
            });
        }
    });

});

router.get('/food',function(req,res){
    Food.find({},{Description : 0,ImagePath : 0},function(err,foundDocs){
        if(err){
            console.log(err);
        } else {
            // console.log(foundDocs);
            res.render('view-food',{food:foundDocs});
        }
    });
}); 

router.post('/food/:id/delete',function(req,res){
    Food.findByIdAndDelete(req.params.id,function(){
        req.flash('success','Food Item Deleted Successfully');
        res.redirect('/admin/food');
    });
});

router.get('/food/:id/modify',function(req,res){
    Food.findById(req.params.id,function(err,foundDoc){
        if(err){
            console.log(err);
        } else {
            // console.log(foundDoc);
            res.render('modify-food',{Food:foundDoc});
        }
    })
});

router.post('/food/:id/modify',upload.single('image'),function(req,res){

    console.log(req.body);

    var updatedFoodItem = {
        Name : req.body.name,
        Price : req.body.price,
        Category : req.body.category,
        Description : req.body.description
    };

    if(typeof req.file !== 'undefined'){
        updatedFoodItem.ImagePath = path.join('/img/Food',(req.body.name).toString().toUpperCase())+'.jpg'; 
    }

    // console.log(updatedFoodItem);

    Food.findByIdAndUpdate(req.params.id,updatedFoodItem,{new:true},function(err,modifiedFood){
        if(err){
            console.log(err);
            req.flash('err','An error occured.');
            res.redirect('/admin/food');
        } else {
            console.log(modifiedFood);
            req.flash('success','Data updated successfully');
            res.redirect('/admin/food');
        }
    });

});

router.get('/food/new',function(req,res){
    res.render('new-food');
});

router.post('/food/new',upload.single('image'),function(req,res){
    var newFoodItem = {
        Name : req.body.name,
        Price : req.body.price,
        Category : req.body.category,
        ImagePath : path.join('/img/Food',(req.body.name).toString().toUpperCase())+'.jpg',
        Description : req.body.description
    };

    console.log(newFoodItem);

    Food.insertMany(newFoodItem,function(err,doc){
        if(err){
            console.log(err);
            req.flash('err','An error occured.');
            res.redirect('/admin/food');
        } else {
            req.flash('success','Data Inserted successfully');
            res.redirect('/admin/food');
        }
    });
});

module.exports = router;