const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const keys = require("./keys.js");

// options to control how the token is extracted from the request
const opts = {};
// this is how the JWT will be included with the requrest
// the returns the encoded JWT string or null
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = function(passport) {
	passport.use(
		// constructing the json web token authentication strategy
		// jwt_payload is an object lieral containing the decoded JWT payload
		// done is a passport error first callback accepting arguments error, user, info
		new JwtStrategy(opts, function(jwt_payload, done) {

			var userQ = User.findById({ _id: jwt_payload.id });

			userQ.exec(function(err, user) {
				if (err) return done(err, false);
				
				if (user) {
					return done(null, user);
				}
				return done(null, false);
			});
		})
	);

}
