import axios from 'axios'
import { useLoggedUserState } from '../store/userStore';

export const api = axios.create({
  baseURL: "http://localhost:5000", // pamietamy o http
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalResponse = error.config;

    if (error.status == 403 && !originalResponse._retry && !originalResponse.url.includes('/refresh')) {
      originalResponse._retry = true;

      try {
        await api.get("/api/auth/refreshtoken");

        // nowe ciasteczko z tokenem zostanie dolaczone automatycznie
        return api(originalResponse);
      } catch (error) {
        useLoggedUserState.getState().logout()
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
