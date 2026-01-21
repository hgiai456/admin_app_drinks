import React, { useState, useEffect, useRef } from "react";
import ProductService from "@services/product.service.js";
import "@styles/components/_product-grid.scss";
import { navigation } from "@utils/editorHelpers";

/**
 * Component hiển thị sản phẩm bán chạy (Best Sellers)
 * Hiển thị 4 sản phẩm/line, auto scroll mỗi 2 giây
 */
export default function BestSellerGrid({
  limit = 8,
  onProductClick,
  onViewMore,
  formatPrice,
  getCategoryName,
  title = "BEST SELLERS",
  itemsPerView = 4,
  autoScrollInterval = 2000,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoSlideRef = useRef(null);

  // Responsive items per view
  const [visibleItems, setVisibleItems] = useState(itemsPerView);

  useEffect(() => {
    fetchBestSellers();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [limit]);

  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 576) {
      setVisibleItems(1);
    } else if (width < 768) {
      setVisibleItems(2);
    } else if (width < 1024) {
      setVisibleItems(3);
    } else {
      setVisibleItems(itemsPerView);
    }
  };
  const handleProductClick = (product) => {
    console.log("🔍 BestSellerGrid - Product clicked:", product);

    if (onProductClick) {
      onProductClick(product);
    } else {
      scrollToTop();
      setTimeout(() => {
        navigation(`product/${product.id}`);
      }, 100);
    }
  };

  useEffect(() => {
    if (products.length > visibleItems) {
      autoSlideRef.current = setInterval(() => {
        handleNext();
      }, autoScrollInterval);

      return () => {
        if (autoSlideRef.current) {
          clearInterval(autoSlideRef.current);
        }
      };
    }
  }, [products, currentIndex, visibleItems, autoScrollInterval]);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await ProductService.getAllProducts();

      if (!response || !Array.isArray(response)) {
        setProducts([]);
        return;
      }

      // ✅ FIX: Dùng total_buyturn từ backend, KHÔNG CẦN tính toán lại
      const productsWithBuyturns = response
        .map((product) => {
          const price =
            product.product_details?.[0]?.price || product.price || 0;

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            image: product.image,
            category_id: product.category_id,
            brand_id: product.brand_id,
            price: price,
            total_buyturn: product.total_buyturn || 0,
            product_details: product.product_details,
          };
        })
        .filter((p) => p.total_buyturn > 0)
        .sort((a, b) => b.total_buyturn - a.total_buyturn);

      setProducts(productsWithBuyturns);
    } catch (error) {
      setError("Không thể tải sản phẩm bán chạy");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = () => {
    navigation("menu");
  };

  const maxIndex = Math.max(0, products.length - visibleItems);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleMouseEnter = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (products.length > visibleItems) {
      autoSlideRef.current = setInterval(() => {
        handleNext();
      }, autoScrollInterval);
    }
  };

  if (loading) {
    return (
      <section className="best-sellers-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{title}</h2>
          </div>
          <div className="products-loading">
            <div className="loading-spinner">☕</div>
            <p>Đang tải sản phẩm bán chạy...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="best-sellers-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{title}</h2>
          </div>
          <div className="no-products">
            <div className="no-products-icon">📭</div>
            <h3>Chưa có sản phẩm bán chạy</h3>
            <p>
              {error ||
                "Hiện chưa có sản phẩm nào có lượt mua. Hãy quay lại sau!"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const slideWidth = 100 / visibleItems;
  const translateX = currentIndex * slideWidth;

  return (
    <section className="best-sellers-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">
            Top {products.length} sản phẩm được yêu thích nhất
          </p>
        </div>

        <div
          className="bestseller-carousel-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {products.length > visibleItems && (
            <button
              className="carousel-arrow prev"
              onClick={handlePrev}
              aria-label="Previous"
            >
              <span>‹</span>
            </button>
          )}

          {/* PRODUCTS SLIDER */}
          <div className="bestseller-carousel">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${translateX}%)`,
                transition: "transform 0.5s ease-in-out",
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="carousel-item"
                  style={{ width: `${slideWidth}%` }}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="product-card bestseller-card">
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
                      <div className="product-badge bestseller-badge">
                        <span>Top {index + 1}</span>
                      </div>
                      <div className="buyturns-badge">
                        <span>🔥 {product.total_buyturn} lượt mua</span>
                      </div>
                    </div>

                    <div className="product-info">
                      <div className="product-category">
                        {getCategoryName
                          ? getCategoryName(product.category_id)
                          : ""}
                      </div>
                      <h3 className="product-name">{product.name}</h3>

                      <div className="product-footer">
                        <div className="product-price">
                          <span className="current-price">
                            {formatPrice
                              ? formatPrice(product.price)
                              : `${product.price?.toLocaleString()}đ`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {products.length > visibleItems && (
            <button
              className="carousel-arrow next"
              onClick={handleNext}
              aria-label="Next"
            >
              <span>›</span>
            </button>
          )}
        </div>

        {products.length > visibleItems && (
          <div className="carousel-progress">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`progress-dot ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="section-footer">
          <button className="btn-view-more" onClick={handleViewMore}>
            <span>XEM THÊM</span>
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
