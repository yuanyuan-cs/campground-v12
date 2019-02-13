var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");

var campground = require("./models/campground");
var Comment = require("./models/comments");
var User = require("./models/user");
var seedDB = require("./seeds");

//requireing routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "orange",
    resave: false,
    saveUninitialized: false
    
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passport.authenticate('local', { successFlash: 'Welcome!' });

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

mongoose.connect("mongodb://localhost/yelp_camp_v10", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
//seedDB();


app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// app.use(indexRoutes);
// app.use(commentRoutes);
// app.use(campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCampV2 app has started");
});