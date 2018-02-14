/////////////////////////////////////////////////
//                    SETUP                    //
/////////////////////////////////////////////////

var express = require("express"),
	router = express.Router(),
	User = require("../models/user"),
	passport = require("passport");

/////////////////////////////////////////////////
//                AUTH ROUTES                  //
/////////////////////////////////////////////////

// Root (landing page)
router.get("/", function(req, res){
    res.render("landing");
});

// Show sign up form
router.get("/register", function (req, res) {
	res.render("register");
});

// Handle user sign up
router.post("/register", function (req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			req.flash("error", err.message);	
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
})

/////////////////////////////////////////////////
//                 LOGIN ROUTES                //
/////////////////////////////////////////////////

// Shows the login page
router.get("/login", function(req, res){
	res.render("login");
});

// Logs the user in
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        successFlash: "Logged in successfully.",
        failureFlash: true
}), function(req, res){
});

/////////////////////////////////////////////////
//                 LOGOUT ROUTE                //
/////////////////////////////////////////////////

// Logs the user out
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "You have been logged out!");
	res.redirect("/campgrounds");
});

/////////////////////////////////////////////////
//                   EXPORTS                   //
/////////////////////////////////////////////////

module.exports = router;
