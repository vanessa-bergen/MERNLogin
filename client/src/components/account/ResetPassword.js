import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import axios from "axios";

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      newPassword1: "",
      newPassword2: "",
      errors: {}
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const passwordInput = {
      newPassword1: this.state.newPassword1,
      newPassword2: this.state.newPassword2
    };

    const { match: { params } } = this.props;
    console.log(params.id)

    axios
      .post(`/api/user/resetPassword/${params.id}/${params.token}`, passwordInput)
      .then(res => {
        console.log("password changed");
        this.props.history.push("/login");
      })
      .catch(err => {
        console.log("err ", err.response.data);
        this.setState({
          errors: err.response.data
        })
      })
  }

  render() {
    const { newPassword1, newPassword2, errors } = this.state;
    return (
      <div>
      <Link className="text-left p-4" to="/"> 
        Back
      </Link>
      <div className="container rounded p-3 mt-5 border w-50" id="main">
        <div className="mb-4 mt-4">
          <h4>Reset Password</h4>
          <div 
            class={classnames("alert alert-danger text-center", { alertShown: !errors.invalidToken })} 
            role="alert"
          >
          {errors.invalidToken} 
          <div><Link to="/password/recover"> Click Here </Link> to recover password.</div>
          </div>
          <form noValidate onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                className={classnames("form-control", {
                    // if there is an error for the name this will set invalid: true
                    invalid: errors.newPassword1
                })}
                placeholder="New Password"
                onChange={this.onChange}
                value={newPassword1}
                error={errors.newPassword1}
                id="newPassword1"
                type="password"
              />
              <div className="err-msg">{errors.newPassword1}</div>
            </div>
            <div className="form-group">
              <input
                className={classnames("form-control", {
                    // if there is an error for the name this will set invalid: true
                    invalid: errors.newPassword2
                })}
                placeholder="Confirm New Password"
                onChange={this.onChange}
                value={newPassword2}
                error={errors.newPassword2}
                id="newPassword2"
                type="password"
              />
              <div className="err-msg">{errors.newPassword2}</div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
            >
            Reset Password
            </button>
          </form>
        </div>
      </div>
     </div>

    )
  }
}

ResetPassword.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});


export default connect(mapStateToProps)(ResetPassword);