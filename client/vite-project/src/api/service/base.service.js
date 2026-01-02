import api from '../index.js';

class BaseService{
    constructor(endpoint){
        this.endpoint = endpoint;
    }
    
    async getAll(params = {}) {
        try {
            const response = await api.get(this.endpoint, { params });
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getById(id) {
        try{
            const response = await api.get(`${this.endpoint}/${id}`);
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async create(data) {
        try {
            const response = await api.post(this.endpoint, data);
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async update(id, data) {
        try {
            const response = await api.put(`${this.endpoint}/${id}`, data);
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async delete(id) {
        try {
            const response = await api.delete(`${this.endpoint}/${id}`);
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }
    handleResponse(response){
        const {data} = response;
        return {
            success: true,
            data: data.data || data,
            message: data.message || 'Success',
            pagination: {
                currentPage: data.currentPage,
                totalPage: data.totalPage,
                totalItems: data.totalItems || data.totalOrders || data.totalProducts
            }
        };
    }

    handleError(error){
        const errorResponse = {
            success: false,
            message: "Có lỗi xảy ra",
            status: null,
            errors:null
        }
         if (error.response) {
            errorResponse.status = error.response.status;
            errorResponse.message = error.response.data?.message || error.message;
            errorResponse.errors = error.response.data?.errors;
        } else if (error.request) {
            errorResponse.message = 'Không thể kết nối đến server';
        } else {
            errorResponse.message = error.message;
        }

        console.error('API Error:', errorResponse);
        return errorResponse;
    }
}

export default BaseService;