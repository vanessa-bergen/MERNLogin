const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jws = require('jsonwebtoken');

const validateRegisterInput = require("../validation/register.js");
const validateLoginInput = require("../validation/login.js");

module.exports = function() {
	var User = require('mongoose').model('User');

	var c = {};

	c.create = function(req, res) {
		console.log(JSON.stringify(req.body));

		// first check if the request body is valid
		const { errors, isValid } = validateRegisterInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}
		
		var userQ = User.findOne({email : req.body.email});

		userQ.exec(function(err, user) {
			if (err) return res.status(500).json(err);

			if (user != null) {
				return res.status(400).json("user already exists");
			}

			var newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password
			});

			// hash password
			bcrypt.genSalt(saltRounds, function(err, salt) {
				bcrypt.hash(newUser.password, salt, function(err, hash) {
					if (err) return res.status(500).json("error hashing password");

					newUser.password = hash;
					newUser.save(function(err) {
						if (err) return res.status(500).json(err);

						res.status(201).json(newUser);
					})
				})
			})

		});
	}

	return c;
}