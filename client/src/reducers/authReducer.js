import { SET_CURRENT_USER, USER_LOADING } from "../actions/types";

const isEmpty = require("is-empty");
// define the inistal state
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

//this is where it's going to evaluate any actions that are commited 
// two actions are setting the user and loading
// define how the state should change based on actions
// updates the state
export default function(state = initialState, action) {
  switch (action.type) {
    // if we are setting the current user, want to expand the current state (...state will expand the iterable state to get each element)
    // then set the user and if the user is authenticated
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    // set the loading state to true on load
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}