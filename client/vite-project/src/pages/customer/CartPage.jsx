import React, { useState, useEffect } from "react";
import Layout from "@components/common/Layout.jsx";
import CartService from "@services/cart.service.js";
import "@styles/pages/_cart.scss";
import { triggerCartRefresh } from "@components/common/UtilityFunction";

export default function CartPage({
  user,
  onLogout,
  isGuest = false,
  onLogin,
  onRegister,
}) {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCartData();
  }, [user, isGuest]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      setError("");
      const userId = user?.id || null;
      const cartData = await CartService.getOrCreateCart(userId);
      setCart(cartData);

      const itemsData = await CartService.getCartItems(cartData.id);

      const transformedItems = Array.isArray(itemsData)
        ? itemsData.map((item) => ({
            id: item.id,
            cart_id: item.cart_id,
            product_detail_id: item.product_detail_id,
            quantity: item.quantity,
            product_id: item.product_details?.product?.id,
            product_name: item.product_details?.product?.name,
            product_image: item.product_details?.product?.image,
            product_description: item.product_details?.product?.description,
            size_id: item.product_details?.size_id,
            size_name: `Size ${
              item.product_details?.size_id === 1
                ? "S"
                : item.product_details?.size_id === 2
                  ? "M"
                  : "L"
            }`,
            price: item.product_details?.price,
            oldprice: item.product_details?.oldprice,
            stock_quantity: item.product_details?.quantity,
          }))
        : [];

      setCartItems(transformedItems);
    } catch (error) {
      console.error("❌ Error loading cart:", error);
      setError("Không thể tải giỏ hàng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating((prev) => ({ ...prev, [cartItemId]: true }));
      setMessage("");

      await CartService.updateCartItem(cartItemId, newQuantity);

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item,
        ),
      );

      setMessage("✓ Đã cập nhật");
      setTimeout(() => setMessage(""), 2000);
      triggerCartRefresh();
    } catch (error) {
      setMessage("✗ Lỗi: " + error.message);
    } finally {
      setUpdating((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (!confirm("Xóa sản phẩm này?")) return;

    try {
      setUpdating((prev) => ({ ...prev, [cartItemId]: true }));
      await CartService.removeFromCart(cartItemId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId),
      );
      setMessage("✓ Đã xóa");
      setTimeout(() => setMessage(""), 2000);
      triggerCartRefresh();
    } catch (error) {
      setMessage("✗ Lỗi: " + error.message);
    } finally {
      setUpdating((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Xóa tất cả sản phẩm?")) return;

    try {
      setLoading(true);
      await CartService.clearCart(cart.id);
      setCartItems([]);
      setMessage("✓ Đã xóa tất cả");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage("✗ Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const calculateItemTotal = (item) => {
    return (item.price || 0) * (item.quantity || 0);
  };

  const calculateCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0,
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setMessage("✗ Giỏ hàng trống");
      return;
    }

    if (isGuest) {
      const shouldLogin = confirm(
        "Bạn cần đăng nhập để đặt hàng. Đăng nhập ngay?",
      );

      if (shouldLogin) {
        if (onLogin) {
          onLogin();
        } else {
          alert(
            "Lỗi: Không thể chuyển trang đăng nhập. Vui lòng reload trang.",
          );
        }
      } else {
        console.log("User cancelled login");
      }

      return;
    }
    window.location.hash = "checkout";
  };

  if (loading) {
    return (
      <Layout
        user={user}
        onLogout={onLogout}
        onRegister={onRegister}
        currentPage="cart"
      >
        <div className="cart-simple">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải giỏ hàng...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        user={user}
        onLogout={onLogout}
        onRegister={onRegister}
        currentPage="cart"
      >
        <div className="cart-simple">
          <div className="error-state">
            <h2>Có lỗi xảy ra</h2>
            <p>{error}</p>
            <button onClick={loadCartData} className="btn-retry">
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      user={user}
      onLogout={onLogout}
      onLogin={onLogin}
      onRegister={onRegister}
      currentPage="cart"
    >
      <div className="cart-simple">
        <div className="cart-header">
          <div className="header-top">
            <h1>Giỏ hàng</h1>
            {cartItems.length > 0 && (
              <button onClick={handleClearCart} className="btn-clear">
                Xóa tất cả
              </button>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="cart-summary">
              <span>{getTotalItems()} sản phẩm</span>
              <span className="total">{formatPrice(calculateCartTotal())}</span>
            </div>
          )}
        </div>

        {message && (
          <div
            className={`message ${message.includes("✓") ? "success" : "error"}`}
          >
            {message}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Giỏ hàng trống</h2>
            <p>Thêm sản phẩm để bắt đầu mua sắm</p>
            <button
              onClick={() => (window.location.hash = "menu")}
              className="btn-shop"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    onClick={() =>
                      (window.location.hash = `product/${item.product_id}`)
                    }
                  />

                  <div className="item-info">
                    <h3
                      onClick={() =>
                        (window.location.hash = `product/${item.product_id}`)
                      }
                    >
                      {item.product_name}
                    </h3>
                    <span className="size">{item.size_name}</span>

                    <div className="price-group">
                      <span className="price">{formatPrice(item.price)}</span>
                      {item.oldprice && item.oldprice > item.price && (
                        <span className="old-price">
                          {formatPrice(item.oldprice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={updating[item.id] || item.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={
                          updating[item.id] ||
                          item.quantity >= item.stock_quantity
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className="item-total">
                      {formatPrice(calculateItemTotal(item))}
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating[item.id]}
                      className="btn-remove"
                      title="Xóa"
                    >
                      ×
                    </button>
                  </div>

                  {updating[item.id] && (
                    <div className="item-loading">
                      <div className="spinner-small"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="footer-total">
                <span>Tổng cộng</span>
                <span className="amount">
                  {formatPrice(calculateCartTotal())}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="btn-checkout"
                disabled={cartItems.length === 0}
              >
                Thanh toán
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
