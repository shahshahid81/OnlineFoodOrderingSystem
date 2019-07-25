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

router.get('/',middleware.isAdminLoggedIn,async function(req,res){
    try {
        let foundDocs = await Food.find({},{Description : 0,ImagePath : 0}).exec();
        res.render('admin/view-food',{food:foundDocs});
    } catch(err) {
        console.log(err);
    }
}); 

router.post('/:id/delete',middleware.isAdminLoggedIn,function(req,res){
    Food.findByIdAndDelete(req.params.id,function(){
        req.flash('success','Food Item Deleted Successfully');
        res.redirect('/admin/food');
    });
});

router.get('/:id/modify',middleware.isAdminLoggedIn,async function(req,res){
    try {
        let foundDoc = await Food.findById(req.params.id).exec();
        res.render('admin/modify-food',{Food:foundDoc});
    } catch(err) {
        console.log(err);
    }
});

router.post('/:id/modify',middleware.isAdminLoggedIn,upload.single('image'),async function(req,res){

    var updatedFoodItem = {
        Name : req.body.name,
        Price : req.body.price,
        Category : req.body.category,
        Description : req.body.description
    };

    if(typeof req.file !== 'undefined'){
        updatedFoodItem.ImagePath = path.join('/img/Food',(req.body.name).toString().toUpperCase())+'.jpg'; 
    }

    try {
        await Food.findByIdAndUpdate(req.params.id,updatedFoodItem,{new:true}).exec();
        req.flash('success','Data updated successfully');
        res.redirect('/admin/food');
    } catch(err) {
        console.log(err);
        req.flash('err','An error occured.');
        res.redirect('/admin/food');
    }
});

router.get('/new',middleware.isAdminLoggedIn,function(req,res){
    res.render('admin/new-food');
});

router.post('/new',middleware.isAdminLoggedIn,upload.single('image'),async function(req,res){

    var newFoodItem = {
        Name : req.body.name,
        Price : req.body.price,
        Category : req.body.category,
        ImagePath : path.join('/img/Food',(req.body.name).toString().toUpperCase())+'.jpg',
        Description : req.body.description
    };

    try {
        await Food.insertMany(newFoodItem).exec();
        req.flash('success','Data Inserted successfully');
        res.redirect('/admin/food');
    } catch(err) {
        console.log(err);
        req.flash('err','An error occured.');
        res.redirect('/admin/food');
    }
});

module.exports = router;