/////////////////////////////////////////////////
//                    SETUP                    //
/////////////////////////////////////////////////
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("/models/campground.js")

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/yelpcamp");

/////////////////////////////////////////////////
//                    DATA                     //
/////////////////////////////////////////////////
// var campgrounds = [
// 	{ name: "Sky's Peak", image: "https://farm8.staticflickr.com/7334/27552900264_26954f5f6d.jpg" },
// 	{ name: "Forked Lake", image: "https://farm5.staticflickr.com/4470/36723988354_ee2085f197.jpg" },
// 	{ name: "Kirk Creek", image: "https://farm4.staticflickr.com/3189/3062178880_4edc3b60d5.jpg" },
// 	{ name: "Sky's Peak", image: "https://farm8.staticflickr.com/7334/27552900264_26954f5f6d.jpg" },
// 	{ name: "Forked Lake", image: "https://farm5.staticflickr.com/4470/36723988354_ee2085f197.jpg" },
// 	{ name: "Kirk Creek", image: "https://farm4.staticflickr.com/3189/3062178880_4edc3b60d5.jpg" }
// ]


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
	var newCampground = { name: name, image: image };

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

/////////////////////////////////////////////////
//                   SERVER                    //
/////////////////////////////////////////////////

app.listen(process.env.PORT || 1985, process.env.IP, function () {
	console.log('Server listening on port 1985');
});
