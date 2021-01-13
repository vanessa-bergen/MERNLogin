var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const db = require("./config/keys.js").mongoURI;

var app = express();
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

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

var server = app.listen(4000, function() {
	console.log('listening to requests on port 4000');
});

require('./app/user/routes.js')(app);