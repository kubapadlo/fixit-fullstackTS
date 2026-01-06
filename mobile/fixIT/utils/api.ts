import axios from 'axios'

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: apiUrl, // pamietamy o http
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});