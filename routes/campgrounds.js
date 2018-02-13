/////////////////////////////////////////////////
//                    SETUP                    //
/////////////////////////////////////////////////

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

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
router.post("/", isLoggedIn, function (req, res) {
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
			res.render("campgrounds/new");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// NEW - Shows a form to add a new campground
router.get("/new", isLoggedIn, function (req, res) {
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
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		res.render("campgrounds/edit", {campground: campground});
	});
});

// UPDATE - Update a particular campground, then redirect somehwere
router.put("/:id", checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id", checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err, campground){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

/////////////////////////////////////////////////
//                  MIDDLEWARE                 //
/////////////////////////////////////////////////

// Checks if the user is logged in
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

function checkCampgroundOwnership(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, campground) {
			if(err){
				res.redirect("back");
			} else {
				// Does the user own the campground?
				if (campground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
};

/////////////////////////////////////////////////
//                   EXPORTS                   //
/////////////////////////////////////////////////

module.exports = router;
