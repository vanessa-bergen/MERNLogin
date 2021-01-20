import React, { Component } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

// Provider is a react component, the glue between react and redux
import { Provider } from "react-redux";
// the store holds all the state
import store from "./store";

import Navbar from "./components/layout/Navigation";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Account from "./components/account/Account";


// Check for token to keep user logged in
if (localStorage.jwtToken) {
    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
  // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser());
      // Redirect to login
      window.location.href = "./login";
    }
}

// all the routes in the provider have access to the store
// the individual components use the connect method to map the component to the store
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
              <Navbar />
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute exact path="/myaccount" component={Account} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
