import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Navigation extends Component {
	onLogoutClick = e => {
    	e.preventDefault();
    	console.log("logging out");
    	this.props.logoutUser();
  	};
  	render() {
	    return (
	      <Navbar bg="light" variant="light" expand="lg" sticky="top">
	        <Navbar.Brand href="/">Home</Navbar.Brand>
	        <Navbar.Toggle aria-controls="basic-navbar-nav" />
	        <Navbar.Collapse id="basic-navbar-nav">
	            <Nav className="ml-auto">
	            <NavDropdown alignRight title="Account" id="basic-nav-dropdown">
	                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>

	                <NavDropdown.Divider />
	                <NavDropdown.Item onClick={this.onLogoutClick}>Logout</NavDropdown.Item>
	            </NavDropdown>
	            </Nav>
	        </Navbar.Collapse>
	      </Navbar>
	    );
	}
}

Navigation.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});


export default connect(mapStateToProps, { logoutUser })(Navigation);