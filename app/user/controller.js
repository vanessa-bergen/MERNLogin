const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const validateRegisterInput = require("../validation/register.js");
const validateLoginInput = require("../validation/login.js");
const { validateUpdateUserInput, validateUpdatePasswordInput } = require("../validation/updateUser.js");
const { validateRecoverPasswordEmail, validateResetPasswordInput } = require("../validation/resetPassword.js");
const keys = require("../../config/keys.js");
const { transporter, getPasswordResetURL, resetPasswordEmail } = require("../email/nodemailer.js");

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

        var userQ = User.findOne({ email: req.body.email });

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
                    if (err) return res.status(500).json({ hashingError: "error hashing password" });

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

        var userQ = User.findOne({ email: req.body.email });

        userQ.exec(function(err, user) {
            if (err) return res.status(500).json(err);

            if (user == null) {
                return res.status(400).json({ emailNotFound: "An account with this email does not exist" });
            }

            // check that the password entered is correct
            bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
                if (!isMatch) {
                    return res.status(400).json({ badPassword: "Password is incorrect" })
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
                    keys.secretOrKey, {
                        // 1 hour
                        expiresIn: '1h'
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

        var userQ = User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
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

    c.updatePassword = function(req, res) {
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
                    return res.status(400).json({ badPassword: "Password is incorrect" })
                }

                // need to encrypt the new password
                // hash password
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(req.body.newPassword1, salt, function(err, hash) {
                        if (err) return res.status(500).json({ hashingError: "error hashing password" });

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

    c.requestPasswordReset = function(req, res) {
        const { errors, isValid } = validateRecoverPasswordEmail(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        var userQ = User.findOne({ email: req.body.email });

        userQ.exec(function(err, user) {
            if (err) return res.status(500).json(err);

            if (user == null) {
                return res.status(404).json({ email: "An account with that email address does not exist" });
            }

            const payload = {
                id: user._id,
                email: user.email
            };

            // TODO check this
            // add created_at
            // use the old password hash as the secret key
            // this makes it a one time use token
            // once the user has changed the password, any calls to the route will generate a new password hash
            // this invalidates the secret key
            const passwordKey = user.password
            console.log("encode key ", passwordKey);

            // returns the json web token as a string
            jwt.sign(
                payload,
                passwordKey, {
                    expiresIn: '1h'
                },
                function(err, token) {
                    if (err) console.log(err);

                    // TODO need to email a link
                    console.log("token ", token);

                    const url = getPasswordResetURL(user, token);
                    const emailTemplate = resetPasswordEmail(user, url);

                    // const sendEmail = () => {
                    //   transporter.sendMail(emailTemplate, (err, info) => {
                    //     if (err) {
                    //       res.status(500).json("Error sending email")
                    //     }
                    //     console.log(`** Email sent **`, info.response)
                    //   })
                    // }
                    // sendEmail()
                    console.log("url ", emailTemplate);

                    transporter.sendMail(emailTemplate, function(error, info) {
                        console.log("in send")
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });


                    res.json({ success: true, token: "Bearer " + token });
                }
            );

        })
    }

    c.resetPassword = function(req, res) {
        const { id, token } = req.params;
        const { errors, isValid } = validateResetPasswordInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        var userQ = User.findById(id);
        userQ.exec(function(err, user) {
            if (err) return res.status(400).json({ invalidToken: "The password reset token is invalid." });
            const passwordResetKey = user.password;
            console.log("decode key ", passwordResetKey);

            jwt.verify(token, passwordResetKey, function(err, payload) {
                console.log(err);
                if (err) return res.status(400).json({ invalidToken: "The password reset token is invalid." });

                console.log(payload);

                if (payload.id === id) {
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        bcrypt.hash(req.body.newPassword1, salt, function(err, hash) {
                            console.log(err);
                            if (err) return res.status(500).json({ hashingError: "error hashing password" });

                            user.password = hash;
                            user.save(function(err) {
                                if (err) return res.status(500).json(err);

                                console.log("changing the password to ", req.body.newPassword1);
                                return res.status(200).json(user);
                            })
                        })
                    })
                }
            });

        });
    }

    return c;
}