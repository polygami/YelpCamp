var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

/////////////////////////////////////////////////
//                COMMENT ROUTES               //
/////////////////////////////////////////////////
// NEW
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log("There was an error");
		} else {
			console.log("There was not an error");
			// console.log(campground);
			res.render("comments/new", {campground: campground});
		}
	});
});

// CREATE
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err){
					res.render("comments/new");
				} else {
					campground.comments.push(comment._id);
					campground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
