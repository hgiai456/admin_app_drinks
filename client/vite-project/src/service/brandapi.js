import Brand from '@models/brand.js';

class BrandAPI {
    static baseUrl = 'http://localhost:3003/api/brands';

    static getAuthHeader() {
        const token = localStorage.getItem('admin_token');
        return token ? { Authorization: 'Bearer ' + token } : {};
    }

    static async getAll() {
        try {
            console.log('🔗 Đang gọi API Brands getAll:', this.baseUrl);

            const res = await fetch(this.baseUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi Brands getAll:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Dữ liệu Brands getAll:', data);

            // Xử lý response data
            const brands = data.data || data.brands || data || [];

            return Array.isArray(brands)
                ? brands.map((item) =>
                      Brand && Brand.fromApiResponse
                          ? Brand.fromApiResponse(item)
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
            console.error('❌ Lỗi Brands getAll:', error);
            throw new Error(
                'Lỗi khi tải danh sách thương hiệu: ' + error.message
            );
        }
    }

    static async getPaging({ page = 1, search = '' } = {}) {
        try {
            const url = `${this.baseUrl}?search=${encodeURIComponent(
                search
            )}&page=${page}`;
            console.log('🔗 Đang gọi API Brands Paging:', url);

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });
            console.log('📊 Brands Paging Status:', res.status, res.statusText);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi từ server Brands:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw Brands Paging Data:', data);

            const response = {
                data: data.data || [],
                pagination: {
                    currentPage: data.currentPage || parseInt(page),
                    totalPage: data.totalPage || 1,
                    totalItems: data.totalBrands || data.totalItems || 0,
                    limit: Math.ceil(
                        (data.totalBrands || 0) / (data.totalPage || 1)
                    )
                }
            };

            return response;
        } catch (error) {
            console.error('❌ Lỗi trong Brands getPaging:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            console.log('🔗 Đang tải thương hiệu:', id);

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi getById Brand:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Brand getById data:', data);

            const brandResponse = data.data || data.brand || data;
            return Brand.fromApiResponse(brandResponse);
        } catch (error) {
            console.error('❌ Lỗi trong getById Brand:', error);
            throw new Error('Lỗi khi tải thương hiệu: ' + error.message);
        }
    }

    static async create(brandData) {
        try {
            console.log('🔗 Đang tạo thương hiệu:', brandData);

            // ✅ Nếu là Brand instance, sử dụng toApiFormat
            const payload =
                brandData instanceof Brand
                    ? brandData.toApiFormat()
                    : brandData;

            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(payload)
            });

            console.log('📊 Create Brand Status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi tạo thương hiệu:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw Create Response:', data);

            // ✅ Convert response thành Brand instance
            const brandResponse = data.data || data.brand || data;
            return Brand.fromApiResponse(brandResponse);
        } catch (error) {
            console.error('❌ Lỗi trong create Brand:', error);
            throw error;
        }
    }

    static async update(id, brandData) {
        try {
            console.log('🔗 Đang cập nhật thương hiệu:', id, brandData);

            // ✅ Nếu là Brand instance, sử dụng toApiFormat
            const payload =
                brandData instanceof Brand
                    ? brandData.toApiFormat()
                    : brandData;

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(payload)
            });

            console.log('📊 Update Brand Status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi cập nhật thương hiệu:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw Update Response:', data);

            // ✅ Convert response thành Brand instance
            const brandResponse = data.data || data.brand || data;
            return Brand.fromApiResponse(brandResponse);
        } catch (error) {
            console.error('❌ Lỗi trong update Brand:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            console.log('🔗 Đang xóa thương hiệu:', id);

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            console.log('📊 Delete Brand Status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi xóa thương hiệu:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Thương hiệu đã xóa:', data);

            return data.data || data.brand || data;
        } catch (error) {
            console.error('❌ Lỗi trong delete Brand:', error);
            throw error;
        }
    }
}

export default BrandAPI;
