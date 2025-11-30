import axios from 'axios'

export const api = axios.create({
  baseURL: "http://localhost:5000", // pamietamy o http
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});
