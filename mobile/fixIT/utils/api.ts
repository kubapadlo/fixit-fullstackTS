import axios from 'axios'
import { useLoggedUserState } from '../store/userStore';

const apiUrl = process.env.EXPO_PUBLIC_API_URL

export const api = axios.create({
  baseURL: apiUrl, 
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalResponse = error.config;

    if (error.status == 401 && !originalResponse._retry) {
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
