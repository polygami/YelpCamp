var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	author: String,
	text: String
});

// Convert the schema into a model and save it to a variable
module.exports = mongoose.model("Comment", commentSchema);