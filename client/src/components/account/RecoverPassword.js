import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import axios from "axios";

class RecoverPassword extends Component {
	constructor() {
    super();
    this.state = {
    	email: "",
      errors: {}
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
  	// verifu the user has an account
  	// then send email with token to reset password
    e.preventDefault();

    const email = {
      email: this.state.email
    };
    
    axios
      .post("/api/user/requestPasswordReset/", email)
      .then(res => {
          console.log("success");  
          this.setState({
              errors: {}
          })
      })
      .catch(err => {
          this.setState({
              errors: err.response.data
          })
      })
  }

  render() {
  	const { email, errors } = this.state;
  	return (
      <div>
      <Link className="text-left p-4" to="/"> 
        Back
      </Link>
      <div className="container rounded p-3 mt-5 border w-50" id="main">
        <div className="mb-4 mt-4">
          <h4>Recover Password</h4>
          <p>
            Enter the email address associated with your account to receive instructions to reset your password.
          </p>
      		<form noValidate onSubmit={this.onSubmit}>
      			<div className="form-group">
              <input
                className={classnames("form-control", {
                  // if there is an error for the name this will set invalid: true
                  invalid: errors.email
                })}
                placeholder="Email"
                onChange={this.onChange}
                value={email}
                error={errors.email}
                id="email"
                type="text"
              />
              <div className="err-msg">{errors.email}</div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
            >
            Send Instructions
            </button>
          </form>
        </div>
      </div>
      </div>
    )
  }
}

export default RecoverPassword


