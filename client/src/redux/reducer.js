import { SET_USER, SET_SESSION } from "./actions";

export function rootReducer(state, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case SET_SESSION:
      return {
        ...state,
        session: action.payload
      };
    default:
      return state;
  }
}
