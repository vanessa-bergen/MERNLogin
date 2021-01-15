import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// connects components to redux store
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			name: "",
			password: "",
			password2: "",
			errors: {}
		};
	}

	componentDidUpdate(prevProps) {
		console.log("component did update: ", this.props);
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
		const newUser = {
			name: this.state.name,
      		email: this.state.email,
      		password: this.state.password,
      		password2: this.state.password2
    	};
		console.log(newUser);

		// hisory keeps track of the session history for the React Router
		// when react router renders a component it'll pass the location, match and history
		// history can be used to reroute
		this.props.registerUser(newUser, this.props.history);
  	};


	render() {
		const { errors } = this.state;

		return (
			<div className="container rounded p-3 mt-5 border w-50">
				<div className="page-title mb-4">
					<h4>Register</h4>
				</div>
				<form noValidate onSubmit={this.onSubmit}>
					<div className="form-group">
						<input
							className={classnames("form-control", {
                    			// if there is an error for the name this will set invalid: true
                    			invalid: errors.name
                  			})}
							placeholder="Name"
							onChange={this.onChange}
							value={this.state.name}
							error={errors.name}
							id="name"
							type="text"
						/>
						<div className="err-msg">{errors.name}</div>
					</div>
					<div className="form-group">
						<input
							className={classnames("form-control", {
                    			invalid: errors.email || errors.userExists
                  			})}
							placeholder="Email"
							onChange={this.onChange}
							value={this.state.email}
							error={errors.email}
							id="email"
							type="email"
						/>
						<div className="err-msg">{errors.email || errors.userExists}</div>
					</div>
					<div className="form-group">
						<input
							className={classnames("form-control", {
                    			invalid: errors.password
                  			})}
							placeholder="Password"
							onChange={this.onChange}
							value={this.state.password}
							error={errors.password}
							id="password"
							type="password"
						/>
						<div className="err-msg">{errors.password}</div>
					</div>
					<div className="form-group">
						<input
							className={classnames("form-control", {
                    			invalid: errors.password2
                  			})}
							placeholder="Confirm Password"
							onChange={this.onChange}
							value={this.state.password2}
							error={errors.password2}
							id="password2"
							type="password2"
						/>
						<div className="err-msg">{errors.password2}</div>
					</div>
					
					<button
	                  type="submit"
	                  className="btn btn-primary btn-block"
                	>
                    Register
                    </button>

                    <div>
	                    <p className="mt-4">
	                    	Already have an account? 
	                    	<Link to="/login"> Login Here!</Link>
	                    </p>
                    </div>
	               
				</form>
			</div>
		);
	}
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  // use auth because that's what we set the authReducer in index.js
  // so this returns the isAuthenticated, user, loading
  auth: PropTypes.object.isRequired,
  // errorReducer
  errors: PropTypes.object.isRequired
};

// mapping our state to our properties
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(Register);