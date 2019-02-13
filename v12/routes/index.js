var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


router.get("/", function(req, res){
    
    res.render("landing");
    
});

//show register form
router.get("/register", function(req, res) {
    res.render("register");  
});

//handle sign up logic
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("back");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp! " + user.username);
            res.redirect("/campgrounds");
        });
    });

});

//show login form
router.get("/login",function(req, res) {
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", {
       successRedirect: "/campgrounds",
       failureRedirect: "/login",
       failureFlash: true,
       successFlash: "Welcome to YelpCamp! " 
    }), function(req, res){
});

//log out route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged you out.");
    res.redirect("/campgrounds");
})

module.exports = router;
