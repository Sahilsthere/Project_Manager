import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://project-manager-nx71.onrender.com/"; // change port to match backend

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
