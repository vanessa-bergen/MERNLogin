const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = {
	validateRecoverPasswordEmail: function(data) {
		let errors = {}
		console.log("is empty ", isEmpty(data.email));

		data.email = !isEmpty(data.email) ? data.email : "";
		
		if (Validator.isEmpty(data.email)) {
			errors.email = "Email field is required.";
		} else if (!Validator.isEmail(data.email)) {
			errors.email = "Email is invalid.";
		}

		return {
			errors,
			isValid: isEmpty(errors)
		};
	},

	validateResetPasswordInput: function(data) {
		let errors = {}

		data.newPassword1 = !isEmpty(data.newPassword1) ? data.newPassword1 : "";
		data.newPassword2 = !isEmpty(data.newPassword2) ? data.newPassword2 : "";

		if (Validator.isEmpty(data.newPassword1)) {
	    	errors.newPassword1 = "New password field is required.";
	  	}
	  	if (Validator.isEmpty(data.newPassword2)) {
	    	errors.newPassword2 = "Confirm new password field is required.";
	  	}

	  	// TODO: change this to require special characters
		if (!Validator.isLength(data.newPassword1, { min: 6, max: 30 })) {
	    	errors.newPassword1= "Password must be at least 6 characters.";
	  	}
		if (!Validator.equals(data.newPassword1, data.newPassword2)) {
	    	errors.newPassword1 = "Passwords must match.";
	  	}

	  	return { 
	  		errors, 
	  		isValid: isEmpty(errors)
	  	};
	}
}