const middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash('alert','You need to sign in');
        res.status(401);
        res.render('signin');
    }
};

module.exports = middlewareObj;