var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, campground) {
			if(err){
				req.flash("error", "Campground not found!");					
				res.redirect("back");
			} else {
				// Does the user own the campground?
				if (campground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");						
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");	
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, comment) {
			if(err){
				res.redirect("back");
			} else {
				// Does the user own the comment?
				if (comment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");	
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");	
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}

module.exports = middlewareObj;