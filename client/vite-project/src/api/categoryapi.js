import Category from '@models/category.js';

class CategoryAPI {
    static baseUrl = 'http://localhost:3003/api/categories';

    static getAuthHeader() {
        const token = localStorage.getItem('admin_token');
        return token ? { Authorization: 'Bearer ' + token } : {};
    }

    static async getAll() {
        try {
            console.log('🔗 Đang gọi API Categories getAll:', this.baseUrl);

            const res = await fetch(this.baseUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi Categories getAll:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Dữ liệu Categories getAll:', data);

            // Xử lý response data
            const categories = data.data || data.categories || data || [];

            return Array.isArray(categories)
                ? categories.map((item) =>
                      Category && Category.fromApiResponse
                          ? Category.fromApiResponse(item)
                          : {
                                id: item.id,
                                name: item.name,
                                image: item.image,
                                createdAt: item.createdAt,
                                updatedAt: item.updatedAt,
                                ...item
                            }
                  )
                : [];
        } catch (error) {
            console.error('❌ Lỗi Categories getAll:', error);
            throw new Error('Lỗi khi tải danh sách danh mục: ' + error.message);
        }
    }

    static async getPaging({ page = 1, search = '' } = {}) {
        try {
            const url = `${this.baseUrl}?search=${encodeURIComponent(
                search
            )}&page=${page}`;
            console.log('🔗 Đang gọi API Categories Paging:', url);

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });
            console.log(
                '📊 Categories Paging Status:',
                res.status,
                res.statusText
            );

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi từ server Categories:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw Categories Paging Data:', data);
            const response = {
                data: data.data || [],
                pagination: {
                    currentPage: data.currentPage || parseInt(page),
                    totalPage: data.totalPage || 1,
                    totalItems: data.totalCategories || data.totalItems || 0,
                    limit: Math.ceil(
                        (data.totalCategories || 0) / (data.totalPage || 1)
                    )
                }
            };

            return response;
        } catch (error) {
            console.error('❌ Lỗi trong Categories getPaging:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            console.log('🔗 Đang tải danh mục:', id);

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi getById Category:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Category getById data:', data);

            const categoryResponse = data.data || data.category || data;
            return Category.fromApiResponse(categoryResponse);
        } catch (error) {
            console.error('❌ Lỗi trong getById Category:', error);
            throw new Error('Lỗi khi tải danh mục: ' + error.message);
        }
    }

    static async create(categoryData) {
        try {
            console.log('🔗 Đang tạo danh mục:', categoryData);

            // ✅ Nếu là Category instance, sử dụng toApiFormat
            const payload =
                categoryData instanceof Category
                    ? categoryData.toApiFormat()
                    : categoryData;

            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(payload)
            });

            console.log('📊 Create Category Status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi tạo danh mục:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw Create Response:', data);

            // ✅ Convert response thành Category instance
            const categoryResponse = data.data || data.category || data;
            return Category.fromApiResponse(categoryResponse);
        } catch (error) {
            console.error('❌ Lỗi trong create Category:', error);
            throw error;
        }
    }

    static async update(id, categoryData) {
        try {
            console.log('🔗 Đang cập nhật danh mục:', id, categoryData);

            // ✅ Nếu là Category instance, sử dụng toApiFormat
            const payload =
                categoryData instanceof Category
                    ? categoryData.toApiFormat()
                    : categoryData;

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(payload)
            });

            console.log('📊 Update Category Status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi cập nhật danh mục:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw Update Response:', data);

            // ✅ Convert response thành Category instance
            const categoryResponse = data.data || data.category || data;
            return Category.fromApiResponse(categoryResponse);
        } catch (error) {
            console.error('❌ Lỗi trong update Category:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            console.log('🔗 Đang xóa danh mục:', id);

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            console.log('📊 Delete Category Status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi xóa danh mục:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Danh mục đã xóa:', data);

            return data.data || data.category || data;
        } catch (error) {
            console.error('❌ Lỗi trong delete Category:', error);
            throw error;
        }
    }
}

export default CategoryAPI;
