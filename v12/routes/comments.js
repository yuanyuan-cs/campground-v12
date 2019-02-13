var express = require("express");
var router = express.Router({mergeParams: true});
var campground = require("../models/campground")
var Comment =require("../models/comments") 
var middleware = require("../middleware");  //equivalent to "../middleware/index.js"

//new comments
router.get("/new", middleware.isLoggedIn, function(req, res){
    var id = req.params.id.replace(/\s/g,'');
    campground.findById(id, function(err, campground){
        if (err){
            console.log(err);
        }else {
            
                res.render("comments/new", {campground:campground});
        }
    })
})

//handle the comments form
router.post("/", middleware.isLoggedIn, function(req,res){
    //var id = req.params.id.replace(/\s/g,'');
    var id = req.params.id;

    campground.findById(id, function(err, campground) {
        if(err){
            console.log(err);
        } else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    req.flash("error", "oops, something went wrong");
                    console.log(err);
                } else{
                    //add username and id to comment
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 comment.save();
                 console.log(comment.author.username);
                 campground.comments.push(comment);
                 campground.save();
                 req.flash("success", "Successfully added comment");
                 res.redirect("/campgrounds/" + campground._id);
                }
            })
            
        }
    });
});

//edit comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    var id = req.params.id.replace(/\s/g,'');
    var comment_id = req.params.comment_id.replace(/\s/g,'');
    Comment.findById(comment_id , function(err, fooundComment) {
        
            res.render("./comments/edit", {campground_id:id, comment:fooundComment});
        
    });
});

//[update] handling edit comment form 
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    var id = req.params.id;
     var comment_id = req.params.comment_id.replace(/\s/g,'');
     var updatedComment = req.body.comment;
    Comment.findByIdAndUpdate(comment_id, updatedComment, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds/" + id);
        }
    });
});

//comment destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
        } else{
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;
