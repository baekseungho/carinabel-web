import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = import.meta.env.VITE_API_URL || "/api";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("auth-expired"));
    }
    if (import.meta.env.DEV) console.warn(`[API] ${message}`);
    return Promise.reject(error);
  },
);

export default instance;
