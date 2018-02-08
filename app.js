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
	
var commentRoutes		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");

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

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

/////////////////////////////////////////////////
//                   SERVER                    //
/////////////////////////////////////////////////

app.listen(process.env.PORT || 1985, process.env.IP, function () {
	console.log('Server listening on port 1985');
});
