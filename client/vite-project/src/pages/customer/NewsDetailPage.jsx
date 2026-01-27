import { useState, useEffect } from "react";
import NewsService from "@services/news.service.js";
import NewsDetailService from "@services/newsdetail.service.js";
import ProductService from "@services/product.service.js";
import Layout from "@components/common/Layout.jsx";
import "@styles/pages/_newsdetail.scss";
import { sanitizeHtml } from "@utils/editorHelpers.js";

function NewsDetailPage({
  user,
  onLogout,
  isGuest = false,
  onLogin,
  onRegister,
}) {
  const [news, setNews] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get news ID from URL hash
  const getNewsIdFromHash = () => {
    const hash = window.location.hash;
    const match = hash.match(/news\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  const newsId = getNewsIdFromHash();
  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!newsId) {
        setError("Không tìm thấy tin tức");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Fetch news detail
        const newsData = await NewsService.getById(newsId);
        setNews(newsData);

        // Fetch related products
        const newsDetails = await NewsDetailService.getByNewsId(newsId);
        const productIds = newsDetails.map((detail) => detail.product_id);

        if (productIds.length > 0) {
          const response = await ProductService.getPaging({
            page: 1,
            search: "",
            pageSize: 100,
          });

          const productsData = response.data || [];
          const related = productsData
            .filter((p) => productIds.includes(p.id))
            .map((product) => {
              const price =
                product.product_details && product.product_details.length > 0
                  ? product.product_details[0].price
                  : 0;

              return {
                id: product.id,
                name: product.name,
                image: product.image,
                description: product.description,
                category_id: product.category_id,
                price: price, // ← Gán price từ product_details
              };
            });

          console.log("✅ Related products with prices:", related);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("❌ Error fetching news detail:", error);
        setError("Không thể tải tin tức. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId]);

  // ===== FORMAT DATE =====
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ===== GO BACK =====
  const handleGoBack = () => {
    window.location.hash = "news";
  };

  // ===== HANDLE PRODUCT CLICK =====
  const handleProductClick = (productId) => {
    window.location.hash = `product/${productId}`;
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <Layout
        user={user}
        onLogout={onLogout}
        currentPage="news"
        isGuest={isGuest}
        onLogin={onLogin}
        onRegister={onRegister}
      >
        <div className="news-detail-loading">
          <div className="spinner"></div>
          <p>Đang tải tin tức...</p>
        </div>
      </Layout>
    );
  }

  // ===== ERROR STATE =====
  if (error || !news) {
    return (
      <Layout
        user={user}
        onLogout={onLogout}
        currentPage="news"
        isGuest={isGuest}
        onLogin={onLogin}
        onRegister={onRegister}
      >
        <div className="news-detail-error">
          <span className="error-icon">⚠️</span>
          <h2>{error || "Không tìm thấy tin tức"}</h2>
          <button className="btn-back" onClick={handleGoBack}>
            ⬅️ Quay lại danh sách
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      user={user}
      onLogout={onLogout}
      currentPage="news"
      isGuest={isGuest}
      onLogin={onLogin}
      onRegister={onRegister}
    >
      <div className="news-detail-page">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <div className="container">
            <button className="breadcrumb-link" onClick={handleGoBack}>
              Tin tức
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{news.title}</span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <article className="news-detail-content">
          <div className="container">
            {/* Header */}
            <header className="news-header">
              <h1 className="news-title">{news.title}</h1>

              <div className="news-meta">
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span className="meta-text">
                    {formatDate(news.createdAt)}
                  </span>
                </div>
                <div className="meta-item"></div>
              </div>
            </header>

            {news.image && (
              <div className="news-featured-image">
                <img
                  src={news.image}
                  alt={news.title}
                  onError={(e) => {
                    e.target.src =
                      "https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f";
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div
              className="news-body"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(news.content),
              }}
            />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <section className="related-products">
                <h2 className="section-title">Sản phẩm liên quan</h2>
                <div className="products-grid">
                  {relatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="product-image">
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/200x200?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-price">
                          {product.price?.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Back Button */}
            <div className="news-actions">
              <button className="btn-back-large" onClick={handleGoBack}>
                ⬅️ Quay lại danh sách tin tức
              </button>
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
}

export default NewsDetailPage;
