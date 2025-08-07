class CategoryAPI {
    static baseUrl = 'http://localhost:3003/api/categories';

    static getAuthHeader() {
        const token = localStorage.getItem('admin_token');
        return token ? { Authorization: 'Bearer ' + token } : {};
    }

    static async getAll() {
        const res = await fetch(this.baseUrl);
        const data = await res.json();
        return data.data;
    }

    static async getById(id) {
        const res = await fetch(`${this.baseUrl}/${id}`);
        const data = await res.json();
        return data.data;
    }

    static async create(category) {
        const res = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
            body: JSON.stringify(category)
        });
        const data = await res.json();
        return data.data;
    }

    static async update(id, category) {
        const res = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
            body: JSON.stringify(category)
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

export default CategoryAPI;
