import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import axios from "axios";
import { Button,Modal } from 'react-bootstrap'

class Account extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      errors: {},
      showModal: false,
      prevPassword: "",
      newPassword1: "",
      newPassword2: ""
    };

    this.handleModalShowHide = this.handleModalShowHide.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    console.log(this.props.auth.user.id);
    axios
      .get("/api/user/" + this.props.auth.user.id)
      .then(response => {
          this.setState({
              firstname: response.data.firstname,
              lastname: response.data.lastname,
              email: response.data.email
          })   
      })
      .catch(function (err) {
          console.log(err);
      })
  }

  handleModalShowHide = () =>  {
    this.setState({ 
      prevPassword: "",
      newPassword1: "",
      newPassword2: "",
      errors: {},
      showModal: !this.state.showModal 
    });
  }
  

  onChange = e => {
    console.log("changing");
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const updatedUser = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email
    };
    console.log(updatedUser);

    axios
      .put("/api/user/update/" + this.props.auth.user.id, updatedUser)
      .then(res => {
          this.setState({
              firstname: res.data.firstname,
              lastname: res.data.lastname,
              email: res.data.email,
              errors: {}
          })   
      })
      .catch(err => {
          this.setState({
              errors: err.response.data
          })
      })
  };

  onPasswordSubmit = e => {
    e.preventDefault();
    const passwordInput = {
      prevPassword: this.state.prevPassword,
      newPassword1: this.state.newPassword1,
      newPassword2: this.state.newPassword2
    };
    axios
      .put("/api/user/updatePassword/" + this.props.auth.user.id, passwordInput)
      .then(res => {
          console.log("password changed");
          this.handleModalShowHide(); 

      })
      .catch(err => {
          this.setState({
              errors: err.response.data
          })
      })
  }

	render() {
    const { firstname, lastname, email, errors, prevPassword, newPassword1, newPassword2 } = this.state;

  	return (
  		<div className="container rounded p-3 mt-5 border w-50" id="main">
        <div className="mb-4 mt-4">
          <h4>My Account</h4>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  className={classnames("form-control", {
                      // if there is an error for the name this will set invalid: true
                      invalid: errors.firstname
                  })}
                  placeholder="First Name"
                  onChange={this.onChange}
                  value={firstname}
                  error={errors.firstname}
                  id="firstname"
                  type="text"
                />
                <div className="err-msg">{errors.firstname}</div>
              </div>
                  <div className="form-group">
                    <input
                      className={classnames("form-control", {
                          // if there is an error for the name this will set invalid: true
                          invalid: errors.lastname
                      })}
                      placeholder="Last Name"
                      onChange={this.onChange}
                      value={lastname}
                      error={errors.lastname}
                      id="lastname"
                      type="text"
                      />
                      <div className="err-msg">{errors.lastname}</div>
                  </div>
                    <div className="form-group">
                      <input
                        className={classnames("form-control", {
                            invalid: errors.email || errors.userExists
                        })}
                        placeholder="Email"
                        onChange={this.onChange}
                        value={email}
                        error={errors.email}
                        id="email"
                        type="email"
                      />
                      <div className="err-msg">{errors.email || errors.userExists}</div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                    >
                    Save Changes
                    </button>

                    <a type="button" className="text-decoration-none mt-2 d-flex justify-content-center" onClick={this.handleModalShowHide}>
                      Change Password
                    </a>

                    <Modal show={this.state.showModal}>
                      <Modal.Header closeButton onClick={this.handleModalShowHide}>
                        <Modal.Title>Change Password</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form noValidate>
                          <div className="form-group">
                            <input
                              className={classnames("form-control", {
                                  // if there is an error for the name this will set invalid: true
                                  invalid: errors.prevPassword
                              })}
                              placeholder="Current Password"
                              onChange={this.onChange}
                              value={prevPassword}
                              error={errors.prevPassword}
                              id="prevPassword"
                              type="password"
                            />
                            <div className="err-msg">{errors.prevPassword || errors.badPassword}</div>
                          </div>
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

                        </form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleModalShowHide}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" onClick={this.onPasswordSubmit}>
                            Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>

            </form>
          </div>
        </div>
  	);
  }
}

Account.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});


export default connect(mapStateToProps)(Account);