import axios from 'axios'

export const api = axios.create({
  baseURL: "http://localhost:5000", // pamietamy o http
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalResponse = error.config;

    // unikamy petli
    if (error.response.status == 401 && !originalResponse._retry && !originalResponse.url.includes('/refresh')) {
      originalResponse._retry = true;

      try {
        await api.get("/api/auth/refreshtoken",{
            withCredentials: true 
        });

        // ciasteczko z accesstokenem automatycznie zostanie dodane do ciasteczka
        return api(originalResponse);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
