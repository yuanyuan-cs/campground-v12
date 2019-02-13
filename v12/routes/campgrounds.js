var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware");  //equivalent to "../middleware/index.js"

router.get("/", function(req, res){
    
    //Get all the camgrounds from db
    campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log("err");
        } else{
            res.render("campgrounds/index", {campgrounds:allcampgrounds});
        }
    });
    
   // res.render("campgrounds", {campgrounds: campgrounds});
});

//form for create a new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
    
    res.render("campgrounds/new");
    
});

//handling the form for create
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {id: req.user._id, username: req.user.username};
    var newCampground = {name: name, image: image, price: price, description:description, author:author };
    
  //  var newCampground = req.body.campground;
  
    //creat a new campground and save to databse
    campground.create(newCampground, function(err, newlycreated){
        if(err){
            console.log(err);
        } else{
            // newlycreated.aurthor.id = req.user._id;
            // newlycreated.aurthor.username = req.user.username;
            // newlycreated.save();
  
            res.redirect("/campgrounds");
        }
    });
});

//SHOW ROUTE
router.get("/:id", function(req, res) {
    //find the campground with provided id and render show template
    //console.log(req.params.id);;
    var id = req.params.id.replace(/\s/g,'');

    campground.findById(id).populate("comments").exec(function(err, foundCampgroud){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampgroud});
        }
    });
});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    
        var id = req.params.id.replace(/\s/g,'');
        campground.findById(id, function(err, foundCampgroud){
                     res.render("campgrounds/edit", {campground: foundCampgroud});
        });        
});

//updat campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    var id = req.params.id;
    console.log("here");
    console.log(id);
    
    campground.findByIdAndUpdate(id, req.body.campground, function(err, updatedcampground){
            res.redirect("/campgrounds/" + req.params.id);
    });
});

//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    campground.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/campgrounds");
})
});




module.exports = router;