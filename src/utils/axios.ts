import Axios from 'axios';
import { useUserStore } from './authService';
const { REACT_APP_API_URL } = import.meta.env;

const axios = Axios.create({
  // Change it with your API baseURL
  baseURL: `${REACT_APP_API_URL}`,
  headers: { "Content-Type" : "application/json" }
});

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            useUserStore.getState().logout();
            localStorage.removeItem("@Auth:token");
            useUserStore.setState({ user: null, token: null })
            window.location.reload();
            return Promise.reject(error);
        }

        // Errors are surfaced by the caller (service method catch block /
        // route action) with a specific, correctly-formatted message —
        // toasting here too would show the raw response object and double
        // up with that message.
        return Promise.reject(error);
    }
);


axios.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("@Auth:token");
  if (token) {
    config.headers['x-access-token'] = token;
  }

  return config;
});


export default axios;