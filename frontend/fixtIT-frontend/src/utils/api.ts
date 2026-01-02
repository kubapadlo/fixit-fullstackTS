import axios from 'axios'
import { useLoggedUserState } from '../store/userStore';
import { enqueueSnackbar } from "notistack";

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalResponse = error.config;

    if (error.status == 403 && !originalResponse._retry) {
      originalResponse._retry = true;

      try {
        const res = await api.get("/api/auth/refreshtoken");

        const newToken = res.data.accessToken;

        useLoggedUserState.setState({
          accessToken: newToken,
        });

        originalResponse.headers.Authorization = `Bearer ${newToken}`;
        return api(originalResponse);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
