var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

/////////////////////////////////////////////////
//              CAMPGROUND ROUTES              //
/////////////////////////////////////////////////
// LANDING
router.get("/", function (req, res) {
	res.render("landing");
});

// INDEX
router.get("/campgrounds", function(req, res) {
	Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});
});

// CREATE
router.post("/campgrounds", function (req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = { name: name, image: image, description: description };

	Campground.create(newCampground, function (err, campground) {
		if (err) {
			res.render("campgrounds/new");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// NEW
router.get("/campgrounds/new", function (req, res) {
	res.render("campgrounds/new");
});

// SHOW
router.get("/campgrounds/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/show", {campground: campground})
		}
	});
});

module.exports = router;
