// bannerApi.js
class BannerAPI {
    static baseUrl = 'http://localhost:3003/api/banners';

    static getAuthHeader() {
        const token = localStorage.getItem('admin_token');
        return token ? { Authorization: 'Bearer ' + token } : {};
    }

    static async getAll() {
        // GET không cần token
        const res = await fetch(this.baseUrl);
        const data = await res.json();
        return data.data || data;
    }

    static async create(banner) {
        const res = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
            body: JSON.stringify(banner)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    }

    static async update(id, banner) {
        const res = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            },
            body: JSON.stringify(banner)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    }

    static async delete(id) {
        const res = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeader()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    }
}
export { BannerAPI };
