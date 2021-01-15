import { createStore, applyMiddleware, compose } from "redux";
// thunk is middleware that lets you call action creators that retuen a function instead of an action object
// so we can directly access the dispatch method to make async calls from actions
import thunk from "redux-thunk";
// root reducer will be all the reducers combined in reducers/index.js
// since it's called index.js we don't need to specify the name of the file
import rootReducer from "./reducers";

const initialState = {};
const middleware = [thunk];

// creates a redux store that holds the complete state tree of the app
// the store sends the state to the react components, which will then update
// note: need to install redux dev tools in browser
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;