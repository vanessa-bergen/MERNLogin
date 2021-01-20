var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String, 
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model("User", UserSchema);