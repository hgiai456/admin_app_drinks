import Prodetail from '@models/prodetail';

// ProdetailAPI.js

class ProdetailAPI {
    static baseUrl = 'http://localhost:3003/api/prodetails';

    static async getPaging({ page = 1, search = '', limit = 10 } = {}) {
        try {
            const url = `${this.baseUrl}?search=${encodeURIComponent(
                search
            )}&page=${page}&limit=${limit}`;
            console.log('🔗 Đang gọi API:', url);

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            console.log('📊 Status:', res.status, res.statusText);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi từ server:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Raw API Data:', data);

            // ✅ Trả về data nguyên bản để component xử lý
            return data;
        } catch (error) {
            console.error('❌ Lỗi trong getPaging:', error);
            throw error;
        }
    }

    static getAuthHeader() {
        const token = localStorage.getItem('admin_token');
        return token ? { Authorization: 'Bearer ' + token } : {};
    }
    static async getAll() {
        try {
            console.log('🔗 Đang gọi API getAll:', this.baseUrl);

            const res = await fetch(this.baseUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Lỗi getAll:', errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Dữ liệu getAll:', data);

            // Xử lý response data
            const products = data.data || data.prodetails || data || [];

            return Array.isArray(products)
                ? products.map((item) =>
                      Prodetail.fromApiResponse
                          ? Prodetail.fromApiResponse(item)
                          : new Prodetail(
                                item.id,
                                item.name,
                                item.product_id,
                                item.size_id,
                                item.store_id,
                                item.buyturn,
                                item.specification,
                                item.price,
                                item.oldprice,
                                item.quantity,
                                item.img1,
                                item.img2,
                                item.img3,
                                item.createdAt,
                                item.updatedAt
                            )
                  )
                : [];
        } catch (error) {
            console.error('❌ Lỗi getAll:', error);
            throw new Error('Lỗi khi tải danh sách sản phẩm: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            console.log('🔗 Getting product by ID:', id);

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            console.log('✅ Product by ID response:', data);

            return data.data || data; // ✅ HANDLE CẢ 2 TRƯỜNG HỢP
        } catch (error) {
            console.error('❌ Error getting product by ID:', error);
            throw error;
        }
    }

    static async create(prodetail) {
        const res = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
            body: JSON.stringify(prodetail)
        });
        const data = await res.json();
        return data.data;
    }

    static async update(id, prodetail) {
        const res = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
            body: JSON.stringify(prodetail)
        });
        const data = await res.json();
        return data.data;
    }

    static async delete(id) {
        const res = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeader()
        });
        const data = await res.json();
        return data.data;
    }
    //METHOD lấy product_details bằng size_id và product_id
    static async getProductDetailBySizeAndProduct(productId, sizeId) {
        try {
            const url = `http://localhost:3003/api/prodetail?product_id=${productId}&size_id=${sizeId}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            console.log('✅ Product detail:', data);

            return data.data || data;
        } catch (error) {
            console.error('❌ Error getting product detail:', error);
            throw error;
        }
    }
    // ✅ THÊM METHOD getProductDetailsByProductId
    static async getProductDetailsByProductId(productId) {
        try {
            console.log('🔗 Getting product details by product ID:', productId);

            const res = await fetch(`${this.baseUrl}?product_id=${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            console.log('✅ Product details by product ID:', data);

            // Lọc theo product_id nếu API trả về tất cả
            const allDetails = data.data || data.prodetails || data || [];
            const filteredDetails = Array.isArray(allDetails)
                ? allDetails.filter((detail) => detail.product_id == productId)
                : [];

            return filteredDetails;
        } catch (error) {
            console.error(
                '❌ Error getting product details by product ID:',
                error
            );
            // Fallback: lấy tất cả rồi filter
            try {
                const allDetails = await this.getAll();
                return allDetails.filter(
                    (detail) => detail.product_id == productId
                );
            } catch (fallbackError) {
                console.error('❌ Fallback error:', fallbackError);
                return [];
            }
        }
    }
    static async getAllProductDetails(productId) {
        try {
            const allDetails = await ProdetailAPI.getAll();
            return allDetails.filter(
                (detail) => detail.product_id == productId
            );
        } catch (error) {
            console.error('❌ Error getting all product details:', error);
            return [];
        }
    }
}

export default ProdetailAPI;
