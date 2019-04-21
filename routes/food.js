const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const middleware = require('../middleware/middleware');
const Food = require('../models/food');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../public/img/Food/'));
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name.toUpperCase()+'.jpg');
    }
});

const upload = multer({ storage: storage });

router.get('/',middleware.isAdminLoggedIn,function(req,res){
    Food.find({},{Description : 0,ImagePath : 0},function(err,foundDocs){
        if(err){
            console.log(err);
        } else {
            res.render('admin/view-food',{food:foundDocs});
        }
    });
}); 

router.post('/:id/delete',middleware.isAdminLoggedIn,function(req,res){
    Food.findByIdAndDelete(req.params.id,function(){
        req.flash('success','Food Item Deleted Successfully');
        res.redirect('/admin/food');
    });
});

router.get('/:id/modify',middleware.isAdminLoggedIn,function(req,res){
    Food.findById(req.params.id,function(err,foundDoc){
        if(err){
            console.log(err);
        } else {
            res.render('admin/modify-food',{Food:foundDoc});
        }
    })
});

router.post('/:id/modify',middleware.isAdminLoggedIn,upload.single('image'),function(req,res){

    var updatedFoodItem = {
        Name : req.body.name,
        Price : req.body.price,
        Category : req.body.category,
        Description : req.body.description
    };

    if(typeof req.file !== 'undefined'){
        updatedFoodItem.ImagePath = path.join('/img/Food',(req.body.name).toString().toUpperCase())+'.jpg'; 
    }

    Food.findByIdAndUpdate(req.params.id,updatedFoodItem,{new:true},function(err,modifiedFood){
        if(err){
            console.log(err);
            req.flash('err','An error occured.');
            res.redirect('/admin/food');
        } else {
            req.flash('success','Data updated successfully');
            res.redirect('/admin/food');
        }
    });

});

router.get('/new',middleware.isAdminLoggedIn,function(req,res){
    res.render('admin/new-food');
});

router.post('/new',middleware.isAdminLoggedIn,upload.single('image'),function(req,res){

    var newFoodItem = {
        Name : req.body.name,
        Price : req.body.price,
        Category : req.body.category,
        ImagePath : path.join('/img/Food',(req.body.name).toString().toUpperCase())+'.jpg',
        Description : req.body.description
    };

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