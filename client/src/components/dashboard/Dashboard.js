import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Dashboard extends Component {

  	render() {
    	return (
            <div className="container">
                <div className="page-title mb-4 mt-4">
                    <h4>Welcome!</h4>
                </div>
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