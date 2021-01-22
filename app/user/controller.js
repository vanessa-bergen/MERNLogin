const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const validateRegisterInput = require("../validation/register.js");
const validateLoginInput = require("../validation/login.js");
const { validateUpdateUserInput, validateUpdatePasswordInput } = require("../validation/updateUser.js");
const keys = require("../../config/keys.js");

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
				return res.status(400).json({ userExists: "An account with this email already exists" });
			}

			var newUser = new User({
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				email: req.body.email,
				password: req.body.password
			});

			// hash password
			bcrypt.genSalt(saltRounds, function(err, salt) {
				bcrypt.hash(newUser.password, salt, function(err, hash) {
					if (err) return res.status(500).json({ hashingError : "error hashing password" });

					newUser.password = hash;
					newUser.save(function(err) {
						if (err) return res.status(500).json(err);

						res.status(201).json(newUser);
					})
				})
			})

		});
	}

	c.login = function(req, res) {
		// this will either return a json web token or a dictionary of errors
		console.log(JSON.stringify(req.body));
		const { errors, isValid } = validateLoginInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		var userQ = User.findOne({email : req.body.email});

		userQ.exec(function(err, user) {
			if (err) return res.status(500).json(err);

			if (user == null) {
				return res.status(400).json({ emailNotFound: "An account with this email does not exist" });
			}

			// check that the password entered is correct
			bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
				if (!isMatch) {
					return res.status(400).json({ badPassword: "Password is incorrect"})
				}

				// if passwords match, create JWT payload
				// this payload will be storer in the auth state
				const payload = {
					id: user._id,
					email: user.email
				};

				// returns the json web token as a string
				jwt.sign(
					payload,
					keys.secretOrKey,
					{
						// 1 hour
						expiresIn: 60 * 60
					},
					function(err, token) {
						if (err) console.log(err);
						res.json({ success: true, token: "Bearer " + token });
					}
				);

			});
		})
	}

	c.update = function(req, res) {
		
		const { errors, isValid } = validateUpdateUserInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		var userQ = User.findOneAndUpdate({ _id : req.params.id }, { $set : req.body }, { new : true });
		userQ.exec(function(err, updatedUser) {

			if (err) return res.status(500).json(err);

			if (updatedUser == null) {
				return res.status(404).json({ userNotFound: "An account with this id does not exist" });
			}

			res.status(200).json({
				firstname: updatedUser.firstname,
				lastname: updatedUser.lastname,
				email: updatedUser.email
			})

		})

	}

	c.changePassword = function(req, res) {
		const { errors, isValid } = validateUpdatePasswordInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		var userQ = User.findById(req.params.id);

		userQ.exec(function(err, user) {
			if (err) return res.status(500).json(err);

			if (user == null) {
				return res.status(400).json({ accountNotFound: "An account with this id does not exist" });
			}

			// check that the password entered is correct
			bcrypt.compare(req.body.prevPassword, user.password, function(err, isMatch) {
				if (!isMatch) {
					return res.status(400).json({ badPassword: "Password is incorrect"})
				}

				// need to encrypt the new password
				// hash password
				bcrypt.genSalt(saltRounds, function(err, salt) {
					bcrypt.hash(req.body.newPassword1, salt, function(err, hash) {
						if (err) return res.status(500).json({ hashingError : "error hashing password" });

						user.password = hash;
						user.save(function(err) {
							if (err) return res.status(500).json(err);

							console.log("changing the password to ", req.body.newPassword1);
							res.status(200).json(user)
						})
					})
				})
			})
				
		})

	}

	c.getById = function(req, res) {
		console.log(req.params.id);
		var userQ = User.findById(req.params.id);
		userQ.exec(function(err, user) {
			if (err) return res.status(500).json(err);
			console.log(user);
			if (user == null) {
				return res.status(404).json({ userNotFound: "An account with this id does not exist" });
			}

			res.json(user);

		})
	}

	return c;
}