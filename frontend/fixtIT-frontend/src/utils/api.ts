import axios from 'axios'
import { useLoggedUserState } from '../store/userStore';

export const api = axios.create({
  baseURL: "http://localhost:5000", // pamietamy o http
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = useLoggedUserState.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error with request interceptor: ", error);
    return Promise.reject(error); 
  }
);