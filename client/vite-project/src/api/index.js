import axios from "axios";

//  Tạo axios instance với config mặc định
const api = axios.create({
  baseURL: "https://api.hgcoffee.id.vn/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Request Interceptor - Tự động thêm token
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token =
      localStorage.getItem("admin_token") || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request trong development
    if (import.meta.env.DEV) {
      console.log(
        `🚀 [${config.method?.toUpperCase()}] ${config.url}`,
        config.data || "",
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[${response.status}] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    const { response } = error;

    // Xử lý các error codes
    if (response) {
      switch (response.status) {
        case 401:
          // Token expired hoặc invalid
          console.warn("⚠️ Unauthorized - Redirecting to login");
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          localStorage.removeItem("token");
          // Có thể redirect hoặc dispatch event
          window.dispatchEvent(new CustomEvent("auth:logout"));
          break;
        case 403:
          console.warn("⚠️ Forbidden - Access denied");
          break;
        case 404:
          console.warn("⚠️ Not Found:", response.config.url);
          break;
        case 500:
          console.error("❌ Server Error:", response.data);
          break;
        default:
          console.error(`❌ Error ${response.status}:`, response.data);
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("❌ Request Timeout");
    } else {
      console.error("❌ Network Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
