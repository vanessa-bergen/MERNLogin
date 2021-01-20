import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Profile extends Component {

  	render() {
    	const { user } = this.props.auth;
    	return (
    		<div className="container">
                <div className="page-title mb-4 mt-4">
                    <h4>My Account</h4>
                </div>
            </div>

    	);
    }
}

Profile.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});


export default connect(mapStateToProps)(Profile);