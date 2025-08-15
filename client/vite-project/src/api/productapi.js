import Product from '@models/product.js';

class ProductAPI {
    static baseUrl = 'http://localhost:3003/api/products';

    static getAuthHeader() {
        const token = localStorage.getItem('admin_token');
        return token ? { Authorization: 'Bearer ' + token } : {};
    }

    static async getAll() {
        try {
            console.log('🔗 Đang gọi API Products getAll:', this.baseUrl);

            const res = await fetch(this.baseUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi Products getAll:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Dữ liệu Products getAll:', data);

            // Xử lý response data
            const products = data.data || data.products || data || [];

            return Array.isArray(products)
                ? products.map((item) =>
                      Product && Product.fromApiResponse
                          ? Product.fromApiResponse(item)
                          : {
                                id: item.id,
                                name: item.name,
                                category_id: item.category_id,
                                brand_id: item.brand_id,
                                description: item.description,
                                createdAt: item.createdAt,
                                updatedAt: item.updatedAt
                            }
                  )
                : [];
        } catch (error) {
            console.error('❌ Lỗi Products getAll:', error);
            throw new Error('Lỗi khi tải danh sách sản phẩm: ' + error.message);
        }
    }

    static async getByCategory(categoryId, params = {}) {
        try {
            const { page = 1, limit = 12, search = '' } = params;

            const queryParams = new URLSearchParams({
                category_id: categoryId,
                page: page.toString(),
                limit: limit.toString(),
                ...(search && { search })
            });

            console.log(
                `🔄 Fetching products by category ${categoryId}:`,
                queryParams.toString()
            );

            const response = await fetch(
                `http://localhost:3003/api/products-by-category?${queryParams}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...this.getAuthHeader()
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Products by category response:', result);

            return {
                data: result.data || [],
                totalProducts: result.totalProducts || 0,
                pagination: {
                    currentPage: page,
                    totalPage: Math.ceil((result.totalProducts || 0) / limit),
                    totalItems: result.totalProducts || 0
                }
            };
        } catch (error) {
            console.error('❌ Error fetching products by category:', error);
            throw error;
        }
    }
    static async getCustomizePage({
        page = 1,
        search = '',
        pageSize = 4
    } = {}) {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
                ...(search && { search: search.toString() })
            });

            const url = `http://localhost:3003/api/products-customize-page?${queryParams}`;
            console.log('🔗 Đang gọi API Products Customize Page:', url);

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            console.log(
                '📊 Products Customize Page Status:',
                res.status,
                res.statusText
            );

            if (!res.ok) {
                const errorText = await res.text();
                console.error(
                    '❌ Lỗi từ server Products Customize:',
                    errorText
                );
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw Products Customize Page Data:', data);

            // ✅ XỬ LÝ RESPONSE THEO CẤU TRÚC BACKEND
            const response = {
                data: data.data || [],
                pagination: data.pagination || {
                    currentPage: data.currentPage || parseInt(page),
                    totalPage: data.totalPage || 1,
                    totalItems: data.totalProducts || 0,
                    pageSize: data.pageSize || parseInt(pageSize),
                    hasNextPage: data.pagination?.hasNextPage || false,
                    hasPrevPage: data.pagination?.hasPrevPage || false,
                    nextPage: data.pagination?.nextPage || null,
                    prevPage: data.pagination?.prevPage || null
                }
            };

            console.log('✅ Processed Customize Page Response:', response);
            return response;
        } catch (error) {
            console.error('❌ Lỗi trong Products getCustomizePage:', error);
            throw error;
        }
    }
    static async getPaging({ page = 1, search = '' } = {}) {
        try {
            const url = `${this.baseUrl}?search=${encodeURIComponent(
                search
            )}&page=${page}`;
            console.log('🔗 Đang gọi API Products Paging:', url);

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });
            console.log(
                '📊 Products Paging Status:',
                res.status,
                res.statusText
            );

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi từ server Products:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw Products Paging Data:', data);
            const response = {
                data: data.data || [],
                pagination: {
                    currentPage: data.currentPage || parseInt(page),
                    totalPage: data.totalPage || 1,
                    totalItems: data.totalProducts || data.totalItems || 0, // ✅ FIX: totalProducts
                    limit: Math.ceil(
                        (data.totalProducts || 0) / (data.totalPage || 1)
                    )
                }
            };
            //Trả về data nguyên bảng để component xử lý

            return response;
        } catch (error) {
            console.error('❌ Lỗi trong Products getPaging:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`);
            const data = await res.json();
            return data.data;
        } catch (error) {
            throw new Error('Lỗi khi tải sản phẩm: ' + error.message);
        }
    }

    static async create(productData) {
        try {
            console.log('🔗 Đang tạo sản phẩm:', productData);

            // ✅ Nếu là Product instance, sử dụng toApiFormat
            const payload =
                productData instanceof Product
                    ? productData.toApiFormat() //
                    : productData; //payload có nghĩa là format dữ liệu khi gửi về server

            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(payload) // Gửi lên server với dữ liệu đã format đúng kiểu dữ liệu
            });

            console.log('📊 Create Product Status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi tạo sản phẩm:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw Create Response:', data);

            // ✅ Convert response thành Product instance
            const productResponse = data.data || data.product || data;
            return Product.fromApiResponse(productResponse);
        } catch (error) {
            console.error('❌ Lỗi trong create Product:', error);
            throw error;
        }
    }
    static async update(id, productData) {
        try {
            console.log('🔗 Đang cập nhật sản phẩm:', id, productData);

            // ✅ Nếu là Product instance, sử dụng toApiFormat
            const payload =
                productData instanceof Product
                    ? productData.toApiFormat()
                    : productData;

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(payload)
            });

            console.log('📊 Update Product Status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi cập nhật sản phẩm:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw Update Response:', data);

            // ✅ Convert response thành Product instance
            const productResponse = data.data || data.product || data;
            return Product.fromApiResponse(productResponse);
        } catch (error) {
            console.error('❌ Lỗi trong update Product:', error);
            throw error;
        }
    }
    static async delete(id) {
        try {
            console.log('🔗 Đang xóa sản phẩm:', id);

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            console.log('📊 Delete Product Status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi xóa sản phẩm:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Sản phẩm đã xóa:', data);

            return data.data || data.product || data;
        } catch (error) {
            console.error('❌ Lỗi trong delete Product:', error);
            throw error;
        }
    }
}

export default ProductAPI;
