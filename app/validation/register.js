const Validator = require("validator");
const isEmpty = require("is-empty");

// takes register input data from frontend 
module.exports = function validateRegisterInput(data) {
	let errors = {}

	// is any of the input fields are empty, convert to empty string
	data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
	data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
	data.email = !isEmpty(data.email) ? data.email : "";
	data.password = !isEmpty(data.password) ? data.password : ""; 
	data.password2 = !isEmpty(data.password2) ? data.password2 : ""; 

	// validate all the input fields
	if (Validator.isEmpty(data.firstname)) {
		errors.firstname = "First name field is required";
	}

	if (Validator.isEmpty(data.lastname)) {
		errors.lastname = "Last name field is required";
	}

	if (Validator.isEmpty(data.email)) {
		errors.email = "Email field is required";
	} else if (!Validator.isEmail(data.email)) {
		errors.email = "Email is invalid";
	}

	if (Validator.isEmpty(data.password)) {
    	errors.password = "Password field is required";
  	}
	if (Validator.isEmpty(data.password2)) {
    	errors.password2 = "Confirm password field is required";
  	}

  	// TODO: change this to require special characters
	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    	errors.password = "Password must be at least 6 characters";
  	}
	if (!Validator.equals(data.password, data.password2)) {
    	errors.password2 = "Passwords must match";
  	}

  	return {
  		errors,
  		isValid: isEmpty(errors)
  	};

};