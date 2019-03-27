const middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){

    if(req.isAuthenticated()){
        next();
    } else {
        req.flash('alert','You need to sign in');
        res.status(401);
        res.render('user/signin');
    }

};

middlewareObj.isAdminLoggedIn = function(req,res,next){

    if(req.isAuthenticated()){
        next();
    } else {
        req.flash('alert','You need to sign in');
        res.redirect('/admin/login');
    }

}

module.exports = middlewareObj;