/////////////////////////////////////////////////
//                    SETUP                    //
/////////////////////////////////////////////////

var express = require("express");
var router = express.Router({mergeParams: true}); // mergeParams makes the params accessible
var Campground = require("../models/campground");
var Comment = require("../models/comment");

/////////////////////////////////////////////////
//                COMMENT ROUTES               //
/////////////////////////////////////////////////

// NEW - Shows a form to add a new comment
router.get("/new", isLoggedIn, function(req, res) {
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

// CREATE - Adds a new comment to the database
router.post("/", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err){
					res.render("comments/new");
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					// push the comment's id to campground's comments
					campground.comments.push(comment._id);
					campground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

// EDIT
router.get("/:comment_id/edit", function(req, res) {
	Comment.findById(req.params.comment_id, function(err, comment) {
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {comment: comment, campground_id: req.params.id})
		}
	});
});

// UPDATE
router.put("/:comment_id", function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// DESTROY
router.delete("/:comment_id", function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
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
}

/////////////////////////////////////////////////
//                   EXPORTS                   //
/////////////////////////////////////////////////

module.exports = router;
