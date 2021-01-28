const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = {

  validateUpdateUserInput: function(data) {
    let errors = {}

    data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
    data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
    data.email = !isEmpty(data.email) ? data.email : "";

    if (Validator.isEmpty(data.firstname)) {
      errors.firstname = "First name field is required.";
    }
    if (Validator.isEmpty(data.lastname)) {
      errors.lastname = "Last name field is required.";
    }
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

  validateUpdatePasswordInput: function(data) {
    let errors = {}

    data.prevPassword = !isEmpty(data.prevPassword) ? data.prevPassword : "";
    data.newPassword1 = !isEmpty(data.newPassword1) ? data.newPassword1 : "";
    data.newPassword2 = !isEmpty(data.newPassword2) ? data.newPassword2 : "";

    if (Validator.isEmpty(data.prevPassword)) {
      errors.prevPassword = "Current password field is required.";
    }
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