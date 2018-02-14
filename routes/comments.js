/////////////////////////////////////////////////
//                    SETUP                    //
/////////////////////////////////////////////////

var express = require("express");
var router = express.Router({mergeParams: true}); // mergeParams makes the params accessible
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

/////////////////////////////////////////////////
//                COMMENT ROUTES               //
/////////////////////////////////////////////////

// NEW - Shows a form to add a new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// CREATE - Adds a new comment to the database
router.post("/", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			req.flash("error", "Something went wrong!");	
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err){
					res.render("comments/new");
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment._id);
					campground.save();
					req.flash("success", "Successfully added a comment.");	
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, comment) {
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {comment: comment, campground_id: req.params.id})
		}
	});
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
		if(err) {
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		} else {
			req.flash("success", "The comment was edited.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted!");	
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

/////////////////////////////////////////////////
//                   EXPORTS                   //
/////////////////////////////////////////////////

module.exports = router;
