class CheckoutService {
    static baseUrl = 'http://localhost:3003/api';
    static getAuthHeader() {
        const token =
            localStorage.getItem('token') ||
            localStorage.getItem('admin_token');
        return token ? { Authorization: 'Bearer ' + token } : {};
    }

    static async checkout(checkoutData) {
        try {
            const res = await fetch(`${this.baseUrl}/carts/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(checkoutData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData.message || `HTTP ${res.status}: ${res.statusText}`
                );
            }

            const data = await res.json();
            console.log('✅ Checkout successful:', data);

            return data;
        } catch (error) {
            console.error('❌ Checkout error:', error);
            throw error;
        }
    }

    static validateCheckoutData(data) {
        const errors = [];

        if (!data.cart_id) {
            errors.push('Cart ID không được để trống');
        }

        if (!data.user_id) {
            errors.push('User ID không được để trống');
        }

        if (!data.phone || data.phone.trim().length === 0) {
            errors.push('Số điện thoại không được để trống');
        } else if (!/^[0-9]{10,11}$/.test(data.phone.trim())) {
            errors.push('Số điện thoại phải có 10-11 chữ số');
        }

        if (!data.address || data.address.trim().length === 0) {
            errors.push('Địa chỉ không được để trống');
        } else if (data.address.trim().length < 10) {
            errors.push('Địa chỉ phải có ít nhất 10 ký tự');
        }

        if (data.note && data.note.length > 500) {
            errors.push('Ghi chú không được quá 500 ký tự');
        }

        return errors;
    }
}

export default CheckoutService;
