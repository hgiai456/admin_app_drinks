class CartAPI {
    static baseUrl = 'http://localhost:3003/api';
    static getAuthHeader() {
        const token =
            localStorage.getItem('token') ||
            localStorage.getItem('admin_token');
        return token ? { Authorization: 'Bearer ' + token } : {};
    }

    static getSessionId() {
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = Date.now().toString();
            localStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    static async getCartItemCount(userId = null) {
        try {
            const cart = await this.getOrCreateCart(userId);
            const cartItems = await this.getCartItems(cart.id);

            const totalItems = Array.isArray(cartItems)
                ? cartItems.reduce(
                      (total, item) => total + (item.quantity || 0),
                      0
                  )
                : 0;
            console.log('✅ Cart item count:', totalItems);
            return totalItems;
        } catch (error) {
            console.error('❌ Error getting cart item count:', error);
            return 0; // ✅ THÊM RETURN
        }
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

            if (res.status === 409) {
                console.log(
                    '⚠️ Cart already exists, trying to find existing cart...'
                );

                if (userId) {
                    // ✅ TÌM CART THEO USER_ID
                    return await this.getCartByUserId(userId);
                } else {
                    // ✅ TÌM CART THEO SESSION_ID
                    return await this.getCartBySessionId(sessionId);
                }
            }
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

    // ✅ THÊM METHOD TÌM CART THEO USER_ID
    static async getCartByUserId(userId) {
        try {
            console.log('🔍 Finding cart by user_id:', userId);

            const res = await fetch(`${this.baseUrl}/carts/user/${userId}`, {
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
            console.log('✅ Found cart by user_id:', data);
            return data.data || data;
        } catch (error) {
            console.error('❌ Error finding cart by user_id:', error);
            throw error;
        }
    }

    // ✅ THÊM METHOD TÌM CART THEO SESSION_ID (NẾU CẦN)
    static async getCartBySessionId(sessionId) {
        try {
            console.log('🔍 Finding cart by session_id:', sessionId);

            // ✅ NẾU BACKEND KHÔNG CÓ API RIÊNG, SỬ DỤNG CÁCH KHÁC
            // Có thể cần implement API mới ở backend hoặc xử lý khác

            const res = await fetch(
                `${this.baseUrl}/carts-by-session?session_id=${sessionId}`,
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
            console.log('✅ Found cart by session_id:', data);

            // ✅ LẤY CART ĐẦU TIÊN TỪ DANH SÁCH
            const carts = data.data || data || [];
            if (Array.isArray(carts) && carts.length > 0) {
                return carts[0];
            }

            throw new Error('No cart found for session_id');
        } catch (error) {
            console.error('❌ Error finding cart by session_id:', error);
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

            return data.data || data || []; // ✅ SỬA: Thêm return
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

            //Xử lý khi mà giỏ hàng có tồn tại
            if (res.status === 409) {
                console.log(
                    '⚠️ Product already in cart, trying to update quantity...'
                );
                //Lấy tất cả cart_items sau đó cập nhật số lượng
                const cartItems = await this.getCartItems(cartId);
                const existingItem = cartItems.find(
                    (item) => item.product_detail_id === productDetailId
                );

                if (existingItem) {
                    const newQuantity = existingItem.quantity + quantity;
                    return await this.updateCartItem(
                        existingItem.id,
                        newQuantity
                    );
                }
            }

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
