import React, { Component } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route} from "react-router-dom";

// Provider is a react component, the glue between react and redux
import { Provider } from "react-redux";
// the store holds all the state
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
              <Navbar />
              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
