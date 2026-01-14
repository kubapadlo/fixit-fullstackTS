import axios from 'axios'
import { useLoggedUserState } from '../store/userStore';

const apiUrl = process.env.EXPO_PUBLIC_API_URL

export const api = axios.create({
  baseURL: apiUrl, 
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
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //Bardzo ważne! Używamy czystego axiosa zamiast "api", 
        // aby uniknąć pętli nieskończonej i nie wysyłać starego tokena w nagłówku.
        const res = await api.get("/api/auth/refreshtoken", {
            withCredentials: true 
        });

        const newToken = res.data.accessToken;

        useLoggedUserState.setState({
          accessToken: newToken,
          isAuthenticated: true
        });

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        useLoggedUserState.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);