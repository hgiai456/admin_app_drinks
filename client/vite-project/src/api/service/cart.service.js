import BaseService from "./base.service";
import api from "../index.js";
import { ENDPOINTS } from "../endpoints.js";

class CartService extends BaseService {
  constructor() {
    super(ENDPOINTS.CARTS.BASE);
  }

  static getSessionId() {
    let sessionId = localStorage.getItem("guest_session_id");
    if (!sessionId) {
      sessionId =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("guest_session_id", sessionId);
      console.log("🆔 Created new session ID:", sessionId);
    }
    return sessionId;
  }

  // ===== CART ITEM COUNT =====
  async getCartItemCount(userId = null) {
    try {
      const cart = await this.getOrCreateCart(userId);
      const cartItems = await this.getCartItems(cart.id);

      const totalItems = Array.isArray(cartItems)
        ? cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
        : 0;

      console.log("✅ Cart item count:", totalItems);
      return totalItems;
    } catch (error) {
      console.error("❌ Error getting cart item count:", error);
      return 0;
    }
  }

  // ===== GET OR CREATE CART =====
  async getOrCreateCart(userId = null) {
    const sessionId = CartService.getSessionId();

    try {
      console.log("🛒 Getting or creating cart...");
      console.log("📊 Input params:", { userId, sessionId });

      const payload = userId ? { user_id: userId } : { session_id: sessionId };

      console.log("📦 Request payload:", payload);

      const response = await api.post(ENDPOINTS.CARTS.BASE, payload);
      const data = response.data;

      console.log("✅ Cart created/retrieved:", data);
      return data.data || data;
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("⚠️ Cart already exists (409), fetching existing cart...");
        console.log(
          "🔄 Using:",
          userId ? `user_id: ${userId}` : `session_id: ${sessionId}`
        );

        if (userId) {
          console.log("👤 Fetching cart by user_id:", userId);
          return await this.getCartByUserId(userId);
        } else {
          console.log("🆔 Fetching cart by session_id:", sessionId);
          return await this.getCartBySessionId(sessionId); // ← GIỜ sessionId ĐÃ DEFINED!
        }
      }

      console.error("❌ Error in getOrCreateCart:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error("Lỗi khi tải giỏ hàng: " + error.message);
    }
  }

  // ===== GET CART BY USER ID =====
  async getCartByUserId(userId) {
    try {
      console.log("🔍 Finding cart by user_id:", userId);

      const response = await api.get(ENDPOINTS.CARTS.BY_USER(userId));
      const data = response.data;

      console.log("✅ Found cart by user_id:", data);
      return data.data || data;
    } catch (error) {
      console.error("❌ Error finding cart by user_id:", error);
      throw new Error("Không tìm thấy giỏ hàng người dùng: " + error.message);
    }
  }

  // ===== GET CART BY SESSION ID =====
  async getCartBySessionId(sessionId) {
    try {
      console.log("🔍 Finding cart by session_id:", sessionId);

      const response = await api.get(ENDPOINTS.CARTS.BY_SESSION, {
        params: { session_id: sessionId },
      });
      const data = response.data;

      console.log("✅ Found cart by session_id:", data);

      if (data.data) {
        return data.data;
      } else {
        throw new Error("No cart data in response");
      }
    } catch (error) {
      console.error("❌ Error finding cart by session_id:", error);

      // ✅ Fallback: Create new cart if not found
      console.log("🔄 Cart not found, creating new cart...");
      try {
        const response = await api.post(ENDPOINTS.CARTS.BASE, {
          session_id: sessionId,
        });
        const data = response.data;

        console.log("✅ Created new cart for session:", data);
        return data.data || data;
      } catch (createError) {
        console.error("❌ Error creating new cart:", createError);
        throw new Error("Không thể tạo giỏ hàng mới: " + createError.message);
      }
    }
  }

  // ===== GET CART BY ID =====
  async getById(id) {
    try {
      console.log("🔍 Getting cart by ID:", id);

      const response = await api.get(`${this.endpoint}/${id}`);
      const data = response.data;

      console.log("✅ Cart by ID:", data);
      return data.data || data;
    } catch (error) {
      console.error("❌ Error getting cart by ID:", error);
      throw new Error("Lỗi khi tải giỏ hàng: " + error.message);
    }
  }

  // ===== GET CART ITEMS =====
  async getCartItems(cartId) {
    try {
      console.log("📦 Getting cart items for cart:", cartId);

      const response = await api.get(ENDPOINTS.CARTS.ITEMS.BY_CART(cartId));
      const data = response.data;

      console.log("✅ Cart items:", data);
      return data.data || data || [];
    } catch (error) {
      console.error("❌ Error getting cart items:", error);
      throw new Error("Lỗi khi tải sản phẩm trong giỏ: " + error.message);
    }
  }

  // ===== ADD TO CART =====
  async addToCart(cartId, productDetailId, quantity = 1) {
    try {
      console.log("➕ Adding to cart:", {
        cartId,
        productDetailId,
        quantity,
      });

      const payload = {
        cart_id: cartId,
        product_detail_id: productDetailId,
        quantity: quantity,
      };

      const response = await api.post(ENDPOINTS.CARTS.ITEMS.BASE, payload);
      const data = response.data;

      console.log("✅ Added to cart:", data);
      return data.data || data;
    } catch (error) {
      // ✅ Handle 409 Conflict - Product already in cart
      if (error.response?.status === 409) {
        console.log("⚠️ Product already in cart, updating quantity...");

        const cartItems = await this.getCartItems(cartId);
        const existingItem = cartItems.find(
          (item) => item.product_detail_id === productDetailId
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          return await this.updateCartItem(existingItem.id, newQuantity);
        }
      }

      console.error("❌ Error adding to cart:", error);
      throw new Error("Lỗi khi thêm vào giỏ hàng: " + error.message);
    }
  }

  // ===== UPDATE CART ITEM =====
  async updateCartItem(cartItemId, quantity) {
    try {
      console.log("🔄 Updating cart item:", { cartItemId, quantity });

      const response = await api.put(ENDPOINTS.CARTS.ITEMS.BY_ID(cartItemId), {
        quantity,
      });
      const data = response.data;

      console.log("✅ Cart item updated:", data);
      return data.data || data;
    } catch (error) {
      console.error("❌ Error updating cart item:", error);
      throw new Error("Lỗi khi cập nhật giỏ hàng: " + error.message);
    }
  }

  // ===== REMOVE FROM CART =====
  async removeFromCart(cartItemId) {
    try {
      console.log("🗑️ Removing from cart:", cartItemId);

      const response = await api.delete(
        ENDPOINTS.CARTS.ITEMS.BY_ID(cartItemId)
      );
      const data = response.data;

      console.log("✅ Removed from cart:", data);
      return data.data || data;
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      throw new Error("Lỗi khi xóa sản phẩm: " + error.message);
    }
  }

  // ===== CLEAR CART =====
  async clearCart(cartId) {
    try {
      console.log("🗑️ Clearing cart:", cartId);

      const response = await api.delete(ENDPOINTS.CARTS.CLEAR(cartId));
      const data = response.data;

      console.log("✅ Cart cleared:", data);
      return data.data || data;
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      throw new Error("Lỗi khi xóa giỏ hàng: " + error.message);
    }
  }

  // ===== DELETE CART =====
  async delete(id) {
    try {
      console.log("🗑️ Deleting cart:", id);

      const response = await api.delete(`${this.endpoint}/${id}`);
      const data = response.data;

      console.log("✅ Cart deleted:", data);
      return data.data || data;
    } catch (error) {
      console.error("❌ Error deleting cart:", error);
      throw new Error("Lỗi khi xóa giỏ hàng: " + error.message);
    }
  }

  // ===== CHECKOUT CART =====
  async checkoutCart(cartId, orderData) {
    try {
      console.log("💳 Checking out cart:", cartId, orderData);

      const response = await api.post(`${this.endpoint}/checkout`, {
        cart_id: cartId,
        ...orderData,
      });
      const data = response.data;

      console.log("✅ Checkout successful:", data);
      return data.data || data;
    } catch (error) {
      console.error("❌ Error during checkout:", error);
      throw new Error("Lỗi khi thanh toán: " + error.message);
    }
  }
}

// ✅ Export singleton instance
export default new CartService();
