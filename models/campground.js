var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

// Convert the schema into a model and save it to a variable
module.exports = mongoose.model("Campground", campgroundSchema);