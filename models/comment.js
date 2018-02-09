var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

// Convert the schema into a model and save it to a variable
module.exports = mongoose.model("Comment", commentSchema);