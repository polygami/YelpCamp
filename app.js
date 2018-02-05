/////////////////////////////////////////////////
//                    SETUP                    //
/////////////////////////////////////////////////
var express		= require("express"),
	app			= express(),
	bodyParser	= require("body-parser"),
	mongoose	= require("mongoose"),
	Campground	= require("./models/campground"),
	Comment		= require("./models/comment"),
    seedDB		= require("./seeds");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/yelpcamp");
seedDB();


/////////////////////////////////////////////////
//                   ROUTES                    //
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
//                   SERVER                    //
/////////////////////////////////////////////////

app.listen(process.env.PORT || 1985, process.env.IP, function () {
	console.log('Server listening on port 1985');
});
