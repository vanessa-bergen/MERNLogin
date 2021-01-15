import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			errors: {}
		};
	}

	// check if the user is authenticated when the state changes
	componentDidUpdate(prevProps) {
		console.log("component did update: ", prevProps);
		if (prevProps.auth !== this.props.auth) {
			if (this.props.auth.isAuthenticated) {
				this.props.history.push("/dashboard");
			}
		}
		if (prevProps.errors !== this.props.errors) {
			this.setState({
				errors: this.props.errors
			});
		}
	}

	onChange = e => {
		console.log("changing");
		this.setState({ [e.target.id]: e.target.value });
	};

	onSubmit = e => {
    e.preventDefault();
		const userData = {
      email: this.state.email,
      password: this.state.password
    };
		console.log(userData);
		this.props.loginUser(userData);
  };

	render() {
		const { errors } = this.state;

		return (
			<div className="container rounded p-3 mt-5 border w-50">
				<div className="page-title mb-4">
					<h4>Login</h4>
				</div>
				<form noValidate onSubmit={this.onSubmit}>
					<div className="form-group">
						<input
							className={classnames("form-control", {
	        			invalid: errors.email || errors.emailNotFound
	      			})}
							placeholder="Email"
							onChange={this.onChange}
							value={this.state.email}
							error={errors.email}
							id="email"
							type="email"
						/>
					<div className="err-msg">{errors.email || errors.emailNotFound}</div>
					</div>
					<div className="form-group">
						<input
							className={classnames("form-control", {
          			invalid: errors.password || errors.badPassword
        			})}
							placeholder="Password"
							onChange={this.onChange}
							value={this.state.password}
							error={errors.password}
							id="password"
							type="password"
						/>
						<div className="err-msg">{errors.password || errors.badPassword}</div>
					</div>
					
					<button
            type="submit"
            className="btn btn-primary btn-block"
        	>
          Login
          </button>

          <div>
            <p className="mt-4">
            	Don't have an account?  
            	<Link to="/register"> Register Here!</Link>
            </p>
            <p>Forgot password?</p>
          </div>
	               
				</form>
			</div>
		);
	}
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

// mapping our state to our properties
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);