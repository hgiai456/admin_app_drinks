import Size from '@models/size';

class SizeService {
    static baseUrl = 'http://localhost:3003/api/sizes';

    static getAuthHeader() {
        const token = localStorage.getItem('admin_token');
        return token ? { Authorization: 'Bearer ' + token } : {};
    }

    static async getAll() {
        try {
            const res = await fetch(this.baseUrl);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log('Raw response from getAll:', data);

            // Kiểm tra cấu trúc response
            const sizes = data.data || data.sizes || data;
            if (!Array.isArray(sizes)) {
                console.error('Expected array but got:', sizes);
                return [];
            }

            // Chuyển thành instance Size
            return sizes.map(
                (s) => new Size(s.id, s.name, s.createdAt, s.updatedAt)
            );
        } catch (error) {
            console.error('Error fetching sizes:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log('Raw response from getById:', data);

            const s = data.data || data.size || data;
            return new Size(s.id, s.name, s.createdAt, s.updatedAt);
        } catch (error) {
            console.error('Error fetching size:', error);
            throw error;
        }
    }

    static async create(sizeData) {
        try {
            console.log('Creating size with data:', sizeData);
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(sizeData)
            });

            console.log('Create response status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Create error response:', errorText);
                throw new Error(
                    `HTTP error! status: ${res.status}, message: ${errorText}`
                );
            }

            const data = await res.json();
            console.log('Raw response from create:', data);

            const s = data.data || data.size || data;
            return new Size(s.id, s.name, s.createdAt, s.updatedAt);
        } catch (error) {
            console.error('Error creating size:', error);
            throw error;
        }
    }

    static async update(id, sizeData) {
        try {
            console.log('Updating size ID:', id, 'with data:', sizeData);

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(sizeData)
            });

            console.log('Update response status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Update error response:', errorText);
                throw new Error(
                    `HTTP error! status: ${res.status}, message: ${errorText}`
                );
            }

            const data = await res.json();
            console.log('Raw response from update:', data);

            // Một số API chỉ trả về success message, không trả về size object
            if (data.success || data.message) {
                // Nếu chỉ trả về success, fetch lại size
                return await this.getById(id);
            }

            const s = data.data || data.size || data;
            if (!s.id) {
                // Nếu không có ID trong response, fetch lại size
                return await this.getById(id);
            }

            return new Size(s.id, s.name, s.createdAt, s.updatedAt);
        } catch (error) {
            console.error('Error updating size:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            console.log('Deleting size ID:', id);

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeader()
            });

            console.log('Delete response status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Delete error response:', errorText);
                throw new Error(
                    `HTTP error! status: ${res.status}, message: ${errorText}`
                );
            }

            const data = await res.json();
            console.log('Raw response from delete:', data);

            return data.data || data;
        } catch (error) {
            console.error('Error deleting size:', error);
            throw error;
        }
    }
}

export default SizeService;
