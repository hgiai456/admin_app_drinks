class CartAPI {
    static baseUrl = 'http://localhost:3003/api';
    static getAuthHeader() {
        const token =
            localStorage.getItem('token') ||
            localStorage.getItem('admin_token');
        return token ? { Authorization: 'Bearer' + token } : {};
    }

    static getSessionId() {
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = Date.now().toString();
            localStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    static async getOrCreateCart(userId = null) {
        try {
            console.log('🛒 Getting or creating cart...');
            const sessionId = this.getSessionId();
            const payload = userId
                ? { user_id: userId }
                : { session_id: sessionId };

            const res = await fetch(`${this.baseUrl}/carts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            const data = await res.json();
            console.log('✅ Cart created/retrieved:', data);

            return data.data || data;
        } catch (error) {
            console.error('❌ Error in getOrCreateCart:', error);
            throw error;
        }
    }

    static async getCartItems(cartId) {
        try {
            const res = await fetch(
                `${this.baseUrl}/cart-items/carts/${cartId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...this.getAuthHeader()
                    }
                }
            );
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            console.log('✅ Cart items:', data);
        } catch (error) {
            console.error('❌ Error getting cart items:', error);
            throw error;
        }
    }

    static async addToCart(cartId, productDetailId, quantity = 1) {
        try {
            console.log('➕ Adding to cart:', {
                cartId,
                productDetailId,
                quantity
            });
            const payload = {
                cart_id: cartId,
                product_detail_id: productDetailId,
                quantity: quantity
            };

            const res = await fetch(`${this.baseUrl}/cart-items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            console.log('✅ Added to cart:', data);

            return data.data || data;
        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            throw error;
        }
    }
    static async updateCartItem(cartItemId, quantity) {
        try {
            console.log('🔄 Updating cart item:', { cartItemId, quantity });
            const res = await fetch(
                `${this.baseUrl}/cart-items/${cartItemId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...this.getAuthHeader()
                    },
                    body: JSON.stringify({ quantity })
                }
            );

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            console.log('✅ Cart item updated:', data);

            return data.data || data;
        } catch (error) {
            console.error('❌ Error updating cart item:', error);
            throw error;
        }
    }

    // ✅ XÓA SẢN PHẨM KHỎI GIỎ HÀNG
    static async removeFromCart(cartItemId) {
        try {
            console.log('🗑️ Removing from cart:', cartItemId);

            const res = await fetch(
                `${this.baseUrl}/cart-items/${cartItemId}`,
                {
                    method: 'DELETE',
                    headers: this.getAuthHeader()
                }
            );

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            console.log('✅ Removed from cart:', data);

            return data.data || data;
        } catch (error) {
            console.error('❌ Error removing from cart:', error);
            throw error;
        }
    }

    // ✅ THÊM METHOD ĐỂ XÓA TẤT CẢ ITEMS TRONG CART
    static async clearCart(cartId) {
        try {
            console.log('🗑️ Clearing cart:', cartId);

            const res = await fetch(`${this.baseUrl}/carts/${cartId}/clear`, {
                method: 'DELETE',
                headers: this.getAuthHeader()
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            console.log('✅ Cart cleared:', data);

            return data.data || data;
        } catch (error) {
            console.error('❌ Error clearing cart:', error);
            throw error;
        }
    }
}

export default CartAPI;
