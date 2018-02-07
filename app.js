/////////////////////////////////////////////////
//                    SETUP                    //
/////////////////////////////////////////////////
var express			= require("express"),
	app				= express(),
	bodyParser		= require("body-parser"),
	mongoose		= require("mongoose"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	Campground		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User			= require("./models/user"),
    seedDB			= require("./seeds");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/yelpcamp");
// seedDB();

/////////////////////////////////////////////////
//          PASSPORT & SESSION CONFIG          //
/////////////////////////////////////////////////

app.use(require("express-session")({
	secret: "Now are the winters of our discontent.",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Define middleware to store user as a local object,
// which can be accessed from the EJS files
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

/////////////////////////////////////////////////
//              CAMPGROUND ROUTES              //
/////////////////////////////////////////////////
// LANDING
app.get("/", function (req, res) {
	res.render("landing");
});

// INDEX
app.get("/campgrounds", function(req, res) {
	Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});
});

// CREATE
app.post("/campgrounds", function (req, res) {
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
app.get("/campgrounds/new", function (req, res) {
	res.render("campgrounds/new");
});

// SHOW
app.get("/campgrounds/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/show", {campground: campground})
		}
	});
});

/////////////////////////////////////////////////
//                COMMENT ROUTES               //
/////////////////////////////////////////////////
// NEW
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
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
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					res.render("comments/new");
				} else {
					campground.comments.push(comment._id);
					campground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	})
});

/////////////////////////////////////////////////
//                AUTH ROUTES                  //
/////////////////////////////////////////////////
// Show sign up form
app.get("/register", function (req, res) {
	res.render("register");
});
// Handle user sign up
app.post("/register", function (req, res) {
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

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){
});

/////////////////////////////////////////////////
//                 LOGOUT ROUTE                //
/////////////////////////////////////////////////

app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
/////////////////////////////////////////////////
//                   SERVER                    //
/////////////////////////////////////////////////

app.listen(process.env.PORT || 1985, process.env.IP, function () {
	console.log('Server listening on port 1985');
});
