export const SET_USER = "user/set";
export const SET_SESSION = "session/set";

export const setUser = user => ({ type: SET_USER, payload: user });
export const clearUser = () => ({ type: SET_USER, payload: null });
export const setSession = sessionId => ({
  type: SET_SESSION,
  payload: sessionId
});
