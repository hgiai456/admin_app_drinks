// client/vite-project/api/orderapi.js
import axios from "axios";
const API_URL = "http://localhost:3001/api/orders"; // Sửa lại nếu khác

export const getOrders = (page = 1, limit = 10) =>
  axios.get(`${API_URL}?page=${page}&limit=${limit}`);

export const getOrderById = (id) => axios.get(`${API_URL}/${id}`);

export const updateOrderStatus = (id, status) =>
  axios.put(`${API_URL}/${id}`, { status });
