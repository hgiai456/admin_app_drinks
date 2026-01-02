// client/vite-project/api/orderapi.js
import axios from 'axios';
const API_URL = 'http://localhost:3003/api/orders'; // Sửa lại nếu khác

function getAuthHeader() {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: 'Bearer ' + token } : {};
}

export const getOrders = (page = 1, limit = 10) =>
    axios.get(`${API_URL}?page=${page}&limit=${limit}`);

export const getOrderById = (id) => axios.get(`${API_URL}/${id}`);

export const updateOrderStatus = (id, status) =>
    axios.put(`${API_URL}/${id}`, { status }, { headers: getAuthHeader() });


export async function getOrdersByUserId(userId, page = 1) {
    const res = await fetch(`${API_URL}/user/${userId}?page=${page}`);
    if (!res.ok) throw new Error('Lỗi khi lấy đơn hàng');
    return await res.json();
}