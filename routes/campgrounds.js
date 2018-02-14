/////////////////////////////////////////////////
//                    SETUP                    //
/////////////////////////////////////////////////

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

/////////////////////////////////////////////////
//              CAMPGROUND ROUTES              //
/////////////////////////////////////////////////

// INDEX - Shows all of the campgrounds
router.get("/", function(req, res) {
	Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});
});

// CREATE - Adds a new campground to the database
router.post("/", middleware.isLoggedIn, function (req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = { name: name, image: image, description: description, author: author };

	Campground.create(newCampground, function (err, campground) {
		if (err) {
			req.flash("error", err.message);	
			res.render("campgrounds/new");
		} else {
			req.flash("success", "Successfully added a new campground.");	
			res.redirect("/campgrounds");
		}
	});
});

// NEW - Shows a form to add a new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
	res.render("campgrounds/new");
});

// SHOW - Shows a detailed page of a single campground
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/show", {campground: campground})
		}
	});
});

// EDIT - Show an edit form for one campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		res.render("campgrounds/edit", {campground: campground});
	});
});

// UPDATE - Update a particular campground, then redirect somehwere
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
		if(err){
			req.flash("error", err.message);			
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Successfully updated the campground.");				
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err, campground){
		if (err) {
			req.flash("error", err.message);						
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Successfully deleted the campground.");							
			res.redirect("/campgrounds");
		}
	});
});

/////////////////////////////////////////////////
//                   EXPORTS                   //
/////////////////////////////////////////////////

module.exports = router;
