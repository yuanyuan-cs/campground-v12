//all the middleware goes here

var campground = require("../models/campground");
var Comment = require("../models/comments");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next) {
    if(req.isAuthenticated()){
        var id = req.params.id.replace(/\s/g,'');
        campground.findById(id, function(err, foundCampgroud){
            if (err){
                
                req.flash("error", "Campground not found!");
                
                res.redirect("back");
            } else {
                if(foundCampgroud.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });        
    }else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err){
                res.redirect("back");
            } else{
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                     req.flash("error", "You need to be logged in to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "Please login first!");
    res.redirect("/login");
};

module.exports = middlewareObj;
