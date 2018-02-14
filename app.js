/////////////////////////////////////////////////
//                    SETUP                    //
/////////////////////////////////////////////////

var express				= require("express"),
	app					= express(),
	bodyParser			= require("body-parser"),
	mongoose			= require("mongoose"),
	flash				= require("connect-flash"),
	passport			= require("passport"),
	LocalStrategy		= require("passport-local"),
	methodOverride		= require("method-override"),
	Campground			= require("./models/campground"),
	Comment				= require("./models/comment"),
	User				= require("./models/user"),
	seedDB				= require("./seeds");
	
var commentRoutes		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");

mongoose.connect("mongodb://localhost/yelpcamp");
app.set("view engine", "ejs");
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

/////////////////////////////////////////////////
//                   ROUTES                    //
/////////////////////////////////////////////////

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

/////////////////////////////////////////////////
//                   SERVER                    //
/////////////////////////////////////////////////

app.listen(process.env.PORT || 1985, process.env.IP, function () {
	console.log('Server listening on port 1985');
});
