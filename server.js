var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const db = require("./config/keys.js").mongoURI;

// passport is used to authenticate endpoints - ensure only authorized user's can connect
// uses JSON web token - when authorization is granted, the server returns an access token to the application
// app uses the toekn to access protected APIs
const passport = require("passport");

var app = express();
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(passport.initialize());

mongoose.connect(
	db,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false

	}
)
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));

require('./app/user/model.js');
require('./config/passport.js')(passport);
require('./app/user/routes.js')(app);

var server = app.listen(4000, function() {
	console.log('listening to requests on port 4000');
});