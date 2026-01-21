import React from "react";
import "@styles/components/_product-grid.scss";

/**
 * Component hiển thị danh sách sản phẩm dạng grid
 * @param {Array} products - Danh sách sản phẩm
 * @param {Function} onProductClick - Callback khi click vào sản phẩm
 * @param {Function} onAddToCart - Callback khi thêm vào giỏ hàng
 * @param {Object} addingToCart - Object tracking trạng thái đang thêm vào giỏ
 * @param {Function} formatPrice - Hàm format giá
 * @param {Function} getCategoryName - Hàm lấy tên danh mục
 * @param {Boolean} isGuest - Có phải khách vãng lai không
 * @param {Boolean} loading - Đang loading
 * @param {String} emptyMessage - Thông báo khi không có sản phẩm
 */
export default function ProductGrid({
  products = [],
  onProductClick,
  onAddToCart,
  addingToCart = {},
  formatPrice,
  getCategoryName,
  isGuest = false,
  loading = false,
  emptyMessage = "Không có sản phẩm nào",
}) {
  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner">☕</div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <div className="no-products-icon">📭</div>
        <h3>Không tìm thấy sản phẩm</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`products-grid ${products.length <= 3 ? "few-products" : ""}`}
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="product-card"
          onClick={() => onProductClick && onProductClick(product)}
        >
          <div className="product-image">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&q=80&fit=crop";
              }}
            />
            <div className="product-overlay">
              <button className="quick-view-btn" title="Xem chi tiết">
                👁️
              </button>
            </div>
            <div className="product-badge">
              <span>🔥 Hot</span>
            </div>
          </div>

          <div className="product-info">
            <div className="product-category">
              {getCategoryName ? getCategoryName(product.category_id) : ""}
            </div>
            <h3 className="product-name">{product.name}</h3>

            <div className="product-footer">
              <div className="product-price">
                <span className="current-price">
                  {formatPrice
                    ? formatPrice(product.price)
                    : `${product.price}đ`}
                </span>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart && onAddToCart(product);
                }}
                disabled={addingToCart[product.id]}
              >
                <span className="btn-icon">
                  {addingToCart[product.id] ? "⏳" : "🛒"}
                </span>
                <span className="btn-text">
                  {addingToCart[product.id] ? "Đang thêm..." : "Xem chi tiết"}
                </span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
