var express 		= require("express"),
    app             = express(),
	bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
	methodOverride  = require("method-override"),
	flash           = require("connect-flash"),
	passport        = require("passport"),
	localStrategy   = require("passport-local"),
	Campground 		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User            = require("./models/user"),
	seedDB 			= require("./seeds");

var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
 	indexRoutes 	 = require("./routes/index");

//var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";
//mongoose.connect("mongodb://localhost/yelp_camp_v12", { useNewUrlParser: true ,useUnifiedTopology: true});
mongoose.connect( process.env.DATABASEURL, { useNewUrlParser: true ,useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();   seeds the database


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret : "My bday is in 13  days",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); //used to log the user in
passport.serializeUser(User.serializeUser()); // this is coming from User(from plm package)
passport.deserializeUser(User.deserializeUser());

// adding middleware to every single route(passing req.user)
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds/:id/comments/", commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/", indexRoutes);

var port = process.env.PORT || 3000;
app.listen(port,function(){
	console.log("The YelpCamp Server has started!!")
});