var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware  = require("../middleware") // no need to write index.js(gets auto required)


//INDEX  --show all campgroundscle
router.get("/",function(req,res){
	//get all campgrounds from DB
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
		res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	})
	
});

// Campground.create(
// 	{
// 		name: "Rishikesh, Uttarakhand", 
// 		image: "https://ihplb.b-cdn.net/wp-content/uploads/2014/06/Camping-in-Rishikesh.jpg",
// 		desc: "No water No bathrooms...beautiful place sexy view"
// 	},function(err,campground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log("Newly Added Campground");  
// 			console.log(campground);  
// 		}
// 	})	

// CREATE --add new campgrounds to DB
router.post("/",middleware.isLoggedIn,function(req,res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;//(taking description from new page(from name attribute))
	var author = {
		id : req.user._id,
		username : req.user.username
	}
	var newCampground = {name: name,price: price, image:image,description:description,author : author};
	
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");  
		}
	})	
	 // default redirect is get
});

//NEW -- show form to create a new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

//SHOW -- show more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
	// res.render("show");
})



//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){// can also remove the err line coz findById middleware me bhi use kr rhe h..err hota to yha tk na aa paate
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/edit",{ campground : foundCampground});
		}
	});
	
});




//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});


//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;