var mongoose				= require("mongoose"),
	passportLocalMongoose	= require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String
});

userSchema.plugin(passportLocalMongoose);

// Convert the schema into a model and save it to a variable
var User = mongoose.model("User", userSchema);