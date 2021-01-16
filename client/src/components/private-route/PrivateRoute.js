import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// this takes the component and the rest of the paramters
// so if it's <PrivateRoute path="/protected" component={Protected}> then its returning <Route path="protect" component={Protected}>
// so this will either render the component or the redirect
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

// here we are mapping to the store
// this is how the private route gets auth state to check if the user is authenticated
export default connect(mapStateToProps)(PrivateRoute);