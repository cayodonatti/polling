import { createStore } from "redux";
import { rootReducer } from "./reducer";
import { persistStore, persistReducer } from "redux-persist";
import axiosMain from "axios";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage
};

const initialState = {};
const reducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(reducer, initialState);
export const persistor = persistStore(store);

axiosMain.interceptors.request.use(
  async config => {
    const { user, session } = store.getState();
    const token = user?.token || "";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (session) {
      config.headers.SessionId = session;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axiosMain.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response.status === 401) {
      // handle token expired, etc
    }
    return Promise.reject(err.response.data);
  }
);

export const axios = axiosMain;
