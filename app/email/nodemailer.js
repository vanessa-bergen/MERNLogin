const nodemailer = require("nodemailer");
const keys = require("../../config/keys.js");

module.exports = {

  transporter: nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: keys.email,
      pass: keys.password
    }
  }),

  getPasswordResetURL: function(user, token) {
    return `http://localhost:3000/password/reset/${user._id}/${token}`
  },

  resetPasswordEmail: function(user, url) {
    const from = keys.email
    const to = 'rhea.watsica@ethereal.email'
    const subject = "Chutter Underwriting Password Reset"
    const html = `
    <p>Hi ${user.firstname} ${user.lastname},</p>
    <p>You recently requested to reset your password for your Chutter Underwriting account. You can use the following link to reset your password:</p>
    <a href=${url}>${url}</a>
    <p>This password reset is only valid for the next hour.</p>
    <p>Thanks</p>
    `

    return { from, to, subject, html }
  }

}
