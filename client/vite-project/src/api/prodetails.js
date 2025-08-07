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
            const res = await fetch(`${this.baseUrl}/${id}`);
            const data = await res.json();
            return data.data;
        } catch (error) {
            throw new Error('Lỗi khi tải sản phẩm: ' + error.message);
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
}

export default ProdetailAPI;
