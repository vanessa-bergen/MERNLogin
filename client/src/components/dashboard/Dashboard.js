import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import { logoutUser } from "../../actions/authActions";

class Dashboard extends Component {
	// onLogoutClick = e => {
 //    	e.preventDefault();
 //    	this.props.logoutUser();
 //  	};

  	render() {
    	const { user } = this.props.auth;
    	return (
    		<div>
    			<h4>Hello there {user.name}</h4>
    			
    		</div>


    	);
    }
}

Dashboard.propTypes = {
	//logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

//export default connect(mapStateToProps, { logoutUser })(Dashboard);
export default connect(mapStateToProps)(Dashboard);