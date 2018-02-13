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
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
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
	failureRedirect: "/login"
}), function(req, res){
});

/////////////////////////////////////////////////
//                 LOGOUT ROUTE                //
/////////////////////////////////////////////////

// Logs the user out
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
});

/////////////////////////////////////////////////
//                   EXPORTS                   //
/////////////////////////////////////////////////

module.exports = router;
