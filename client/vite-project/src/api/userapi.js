import User from '@models/usermodel';

class UserAPI {
    static baseUrl = 'http://localhost:3003/api/users';

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
            const users = data.data || data.users || data;
            if (!Array.isArray(users)) {
                console.error('Expected array but got:', users);
                return [];
            }

            // Chuyển thành instance User
            return users.map(
                (u) =>
                    new User(
                        u.id,
                        u.email,
                        u.password || '', // password có thể bị ẩn
                        u.name,
                        u.role,
                        u.avatar,
                        u.phone,
                        u.address,
                        u.createdAt,
                        u.updatedAt
                    )
            );
        } catch (error) {
            console.error('Error fetching users:', error);
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

            const u = data.data || data.user || data;
            return new User(
                u.id,
                u.email,
                u.password || '',
                u.name,
                u.role,
                u.avatar,
                u.phone,
                u.address,
                u.createdAt,
                u.updatedAt
            );
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    static async create(userData) {
        try {
            console.log('Creating user with data:', userData);
            // Sử dụng endpoint /api/users/register thay vì /api/users
            const res = await fetch(
                'http://localhost:3003/api/users/register',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                }
            );

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

            const u = data.data || data.user || data;
            return new User(
                u.id,
                u.email,
                u.password || '',
                u.name,
                u.role,
                u.avatar,
                u.phone,
                u.address,
                u.createdAt,
                u.updatedAt
            );
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async update(id, userData) {
        try {
            console.log('Updating user ID:', id, 'with data:', userData);

            // Nếu không có password, loại bỏ khỏi dữ liệu gửi đi
            const updateData = { ...userData };
            if (!updateData.password) {
                delete updateData.password;
            }

            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(updateData)
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

            // Một số API chỉ trả về success message, không trả về user object
            if (data.success || data.message) {
                // Nếu chỉ trả về success, fetch lại user
                return await this.getById(id);
            }

            const u = data.data || data.user || data;
            if (!u.id) {
                // Nếu không có ID trong response, fetch lại user
                return await this.getById(id);
            }

            return new User(
                u.id,
                u.email,
                u.password || '',
                u.name,
                u.role,
                u.avatar,
                u.phone,
                u.address,
                u.createdAt,
                u.updatedAt
            );
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            console.log('Deleting user ID:', id);

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
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

export default UserAPI;
