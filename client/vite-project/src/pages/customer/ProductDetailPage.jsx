import { useState, useEffect } from "react";
import Layout from "@components/common/Layout.jsx";
import ProductService from "@services/product.service.js";
import SizeService from "@services/size.service.js";
import CartService from "@services/cart.service.js";
import ProdetailService from "@services/prodetail.service.js";
import "@styles/pages/_productdetail.scss";
import BestSellerGrid from "@components/common/BestSellerGrid.jsx";
import { triggerCartRefresh } from "@components/common/UtilityFunction.jsx";
import { navigation, scrollToTop } from "@utils/editorHelpers.js";
import {
  ShoppingCart,
  ShoppingBag,
  Minus,
  Plus,
  Package,
  ChevronRight,
  Home,
  ArrowLeft,
} from "lucide-react";
import AlertMessage from "@components/common/AlertMessage.jsx";

export default function ProductDetailPage({
  user,
  onLogout,
  productId,
  isGuest = false,
  onLogin,
  onRegister,
}) {
  const getCategoryName = (categoryId) => {
    const categoryMap = {
      1: "☕ Cà phê",
      2: "🍵 Trà",
      3: "🥖 Bánh mì",
      4: "🧊 Đá xay",
      8: "☕ Latte",
      10: "🧋 Trà sữa",
    };

    return categoryMap[categoryId];
  };

  //State
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError("");
        const id = parseInt(productId);
        if (isNaN(id) || id <= 0) {
          if (productId === undefined || productId === null) {
            console.error("❌ productId is undefined or null");
            setError("ID sản phẩm không được để trống");
            return;
          }
          console.error("❌ Invalid productId:", productId);
          setError("ID sản phẩm không hợp lệ");
          return;
        }
        const [productData, allSizesData, productDetailsData] =
          await Promise.all([
            ProductService.getById(id),
            SizeService.getAll(),
            ProdetailService.getProductDetailsByProductId(id),
          ]);

        setProduct(productData);

        setSizes([]);
        setProductDetails([]);
        setSelectedSize("");
        setSelectedProductDetail(null);

        if (!Array.isArray(allSizesData) || allSizesData.length === 0) {
          setError("Lỗi: Không tải được danh sách sizes");
          return;
        }

        if (
          !Array.isArray(productDetailsData) ||
          productDetailsData.length === 0
        ) {
          setError("Sản phẩm này chưa có thông tin chi tiết");
          return;
        }

        const availableSizeIds = new Set(
          productDetailsData.map((detail) => detail.size_id),
        );

        const filteredSizes = allSizesData.filter((size) =>
          availableSizeIds.has(size.id),
        );

        const enrichedProductDetails = productDetailsData.map((detail) => {
          const sizeInfo = allSizesData.find((s) => s.id === detail.size_id);

          return {
            id: detail.id,
            size_id: detail.size_id,
            size_name: sizeInfo?.name || `Size ${detail.size_id}`,
            price: detail.price,
            oldprice: detail.oldprice,
            quantity: detail.quantity,
            product_id: detail.product_id,
            specification: detail.specification,
          };
        });

        setSizes(filteredSizes);
        setProductDetails(enrichedProductDetails);

        if (enrichedProductDetails.length > 0) {
          const firstAvailable = enrichedProductDetails.find(
            (detail) => detail.quantity > 0,
          );
          const firstDetail = firstAvailable || enrichedProductDetails[0];

          setSelectedSize(firstDetail.size_id?.toString());
          setSelectedProductDetail(firstDetail);
        }
      } catch (error) {
        console.error("❌ Error loading product data:", error);
        setError("Không thể tải thông tin sản phẩm: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  useEffect(() => {
    if (selectedSize && productDetails.length > 0) {
      const detail = productDetails.find(
        (d) => d.size_id?.toString() === selectedSize,
      );
      setSelectedProductDetail(detail || null);
    }
  }, [selectedSize, productDetails]);

  const handleSizeChange = (sizeId) => {
    setSelectedSize(sizeId);
    setQuantity(1);
    setMessage("");
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (selectedProductDetail && newQuantity > selectedProductDetail.quantity) {
      setMessage(`⚠️ Chỉ còn ${selectedProductDetail.quantity} sản phẩm`);
      return;
    }
    setQuantity(newQuantity);
    setMessage("");
  };

  const handleAddToCart = async () => {
    try {
      if (!selectedProductDetail) {
        setMessage("❌ Vui lòng chọn size");
        return;
      }

      if (quantity > selectedProductDetail.quantity) {
        setMessage(
          `❌ Không đủ hàng. Chỉ còn ${selectedProductDetail.quantity} sản phẩm`,
        );
        return;
      }

      setAddingToCart(true);
      setMessage("");
      const userId = user?.id || null;

      const cart = await CartService.getOrCreateCart(userId);
      await CartService.addToCart(cart.id, selectedProductDetail.id, quantity);

      const guestText = isGuest ? " (khách vãng lai)" : "";
      setMessage(
        ` Đã thêm ${quantity} ${product.name} (${getSizeName(
          selectedSize,
        )}) vào giỏ hàng${guestText}`,
      );
      scrollToTop();
      triggerCartRefresh();
      setQuantity(1);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      setMessage("❌ Lỗi khi thêm vào giỏ hàng: " + error.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getSizeName = (sizeId) => {
    const size = sizes.find((s) => s.id?.toString() === sizeId?.toString());
    return size?.name || `Size ${sizeId}`;
  };

  const getAvailableImages = () => {
    return [product?.image].filter(Boolean);
  };

  const calculateDiscount = () => {
    if (!selectedProductDetail?.oldprice || !selectedProductDetail?.price)
      return 0;
    return Math.round(
      ((selectedProductDetail.oldprice - selectedProductDetail.price) /
        selectedProductDetail.oldprice) *
        100,
    );
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoToCart = () => {
    window.location.hash = "cart";
  };

  const handleViewProduct = (product) => {
    navigation(`product/${product.id}`);
    scrollToTop();
  };

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout} currentPage="product-detail">
        <div className="product-detail-loading">
          <div className="loading-spinner">☕</div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout user={user} onLogout={onLogout} currentPage="product-detail">
        <div className="product-detail-error">
          <h2>❌ Lỗi</h2>
          <p>{error || "Không tìm thấy sản phẩm"}</p>
          <button onClick={handleGoBack} className="btn-back">
            <ArrowLeft size={18} /> Quay lại
          </button>
        </div>
      </Layout>
    );
  }

  const availableImages = getAvailableImages();
  const discount = calculateDiscount();

  return (
    <Layout
      user={user}
      onLogout={onLogout}
      currentPage="product-detail"
      isGuest={isGuest}
      onLogin={onLogin}
      onRegister={onRegister}
    >
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button
            className="breadcrumb-link"
            onClick={() => (window.location.hash = "home")}
          >
            <Home size={14} /> Trang chủ
          </button>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <button
            className="breadcrumb-link"
            onClick={() => (window.location.hash = "menu")}
          >
            Thực đơn
          </button>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <AlertMessage
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />

        <div className="product-detail-content">
          {/* ===== IMAGE ===== */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={availableImages[currentImageIndex]}
                alt={product.name}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&q=80&fit=crop";
                }}
              />
              {discount > 0 && (
                <div className="discount-badge">-{discount}%</div>
              )}
            </div>
          </div>

          {/* ===== INFO ===== */}
          <div className="product-info">
            {/* Category */}
            <div className="product-category-tag">
              {getCategoryName(product.category_id)}
            </div>

            {/* Title */}
            <h1 className="product-title">{product.name}</h1>

            {/* Description */}
            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* ✅ PRICING - Gọn gàng */}
            <div className="product-pricing">
              {selectedProductDetail ? (
                <>
                  <div className="price-main">
                    <span className="current-price">
                      {formatPrice(selectedProductDetail.price)}
                    </span>
                    {selectedProductDetail.oldprice &&
                      selectedProductDetail.oldprice >
                        selectedProductDetail.price && (
                        <span className="old-price">
                          {formatPrice(selectedProductDetail.oldprice)}
                        </span>
                      )}
                  </div>
                  {discount > 0 && (
                    <span className="discount-tag">Giảm {discount}%</span>
                  )}
                </>
              ) : (
                <div className="price-placeholder">Chọn size để xem giá</div>
              )}
            </div>

            {/* ✅ SIZE SELECTOR - Chỉ tên size, không có giá */}
            <div className="size-selector">
              <h3>Kích thước</h3>

              {sizes.length === 0 ? (
                <div className="no-sizes-warning">
                  <p>Đang tải sizes...</p>
                </div>
              ) : (
                <div className="size-options">
                  {sizes.map((size) => {
                    const detail = productDetails.find(
                      (d) => d.size_id === size.id,
                    );
                    if (!detail) return null;

                    const isSelected = selectedSize === size.id?.toString();
                    const isOutOfStock = detail.quantity === 0;

                    return (
                      <button
                        key={size.id}
                        className={`size-option ${isSelected ? "selected" : ""} ${isOutOfStock ? "unavailable" : ""}`}
                        onClick={() => {
                          if (!isOutOfStock) {
                            handleSizeChange(size.id?.toString());
                          }
                        }}
                        disabled={isOutOfStock}
                        title={
                          isOutOfStock
                            ? "Hết hàng"
                            : `${size.name} - ${formatPrice(detail.price)}`
                        }
                      >
                        <span className="size-name">{size.name}</span>
                        {isOutOfStock && (
                          <span className="stock-status">Hết hàng</span>
                        )}
                        {isSelected && !isOutOfStock && (
                          <span className="selected-indicator">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ✅ QUANTITY - Gọn hơn */}
            {selectedProductDetail && selectedProductDetail.quantity > 0 && (
              <div className="quantity-selector">
                <div className="quantity-header">
                  <h3>Số lượng</h3>
                  <span className="stock-info">
                    Còn <strong>{selectedProductDetail.quantity}</strong> sản
                    phẩm
                  </span>
                </div>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    min="1"
                    max={selectedProductDetail.quantity}
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= selectedProductDetail.quantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {selectedProductDetail && selectedProductDetail.quantity === 0 && (
              <div className="out-of-stock-warning">
                <span className="warning-icon">⚠️</span>
                <span className="warning-text">
                  Size này hiện đã hết hàng. Vui lòng chọn size khác.
                </span>
              </div>
            )}

            {/* ✅ ACTIONS - Gọn gàng */}
            <div className="product-actions">
              <button
                className="btn-add-to-cart"
                onClick={handleAddToCart}
                disabled={
                  !selectedProductDetail ||
                  selectedProductDetail.quantity === 0 ||
                  addingToCart
                }
              >
                {addingToCart ? (
                  "Đang thêm..."
                ) : (
                  <>
                    <ShoppingCart size={20} /> Thêm vào giỏ hàng
                  </>
                )}
              </button>

              <button className="btn-view-cart" onClick={handleGoToCart}>
                <ShoppingBag size={20} />
              </button>
            </div>
          </div>
        </div>

        <BestSellerGrid
          limit={5}
          onProductClick={handleViewProduct}
          formatPrice={formatPrice}
          getCategoryName={getCategoryName}
          title="SẢN PHẨM BÁN CHẠY"
        />
      </div>
    </Layout>
  );
}
