class checkoutAPI {
    static baseUrl = 'http://localhost:3003/api';

    static async checkout(checkoutData) {
        try {
            const res = await fetch(`${this.baseUrl}/carts/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });
        } catch (error) {}
    }
}
