import { useEffect, useState } from "react";
import NewsService from "@services/news.service.js";
import ProductService from "@services/product.service.js"; // ✅ THÊM
import News from "@models/news.js";
import Modal from "@components/admin/ModelComponent.jsx";
import "@styles/pages/_admin.scss";
import "@styles/pages/_news.scss";
import NewsDetailService from "@services/newsdetail.service";

function NewsManagement() {
  const [newsList, setNewsList] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    product_ids: [],
  });

  // ===== HELPER FUNCTIONS =====
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getExcerpt = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // ✅ THÊM: Get product names from IDs
  const getProductNames = (productIds) => {
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return "Không có sản phẩm";
    }

    return productIds
      .map((id) => {
        const product = products.find((p) => p.id === id);
        return product ? product.name : `#${id}`;
      })
      .join(", ");
  };

  // ===== FETCH DATA =====
  const fetchNews = async (pageNum = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const result = await NewsService.getPaging({
        page: pageNum,
        search: searchTerm,
      });
      const newsWithProducts = await Promise.all(
        result.data.map(async (news) => {
          try {
            const newsDetails = await NewsDetailService.getByNewsId(news.id);
            return {
              ...news,
              product_ids: newsDetails.map((detail) => detail.product_id),
            };
          } catch (error) {
            console.error(
              `❌ Error loading news-details for news ${news.id}:`,
              error
            );
            return { ...news, product_ids: [] };
          }
        })
      );
      console.log(" News data:", result);

      setNewsList(newsWithProducts);
      setTotalPage(result.pagination.totalPage);
      setTotalItems(result.pagination.totalItems);
      setPage(result.pagination.currentPage);
    } catch (error) {
      console.error("❌ Error fetching news:", error);
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
      setLoadingData(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const allProducts = await ProductService.getAllProducts();
      setProducts(allProducts || []);
    } catch (error) {
      console.error("❌ Error loading products:", error);
      setMessage("⚠️ Không thể tải danh sách sản phẩm");
    }
  };

  // ===== USEEFFECT =====
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchNews(page, search);
  }, [page, search]);

  // ===== MODAL HANDLERS =====
  const openCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setForm({ title: "", content: "", image: "", product_ids: [] });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (news) => {
    setModalMode("edit");
    setEditingId(news.id);
    try {
      const newsDetails = NewsDetailService.getByNewsId(news.id);
      const relateProductIds = newsDetails.map((detail) => detail.product_id);
      setForm({
        title: news.title || "",
        content: news.content || "",
        image: news.image || "",
        product_ids: relateProductIds,
      });
    } catch (error) {
      console.error("❌ Error loading news details:", error);
      setForm({
        title: news.title || "",
        content: news.content || "",
        image: news.image || "",
        product_ids: [],
      });
    }

    setErrors({});
    setShowModal(true);
  };

  const openDetailModal = (news) => {
    setSelectedNews(news);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDetailModal(false);
    setForm({ title: "", content: "", image: "", product_ids: [] });
    setErrors({});
    setSelectedNews(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProductsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setForm((prev) => ({ ...prev, product_ids: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newsData = new News(form);
      const validation = newsData.validate();

      if (!validation.isValid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }

      let newsId;

      if (modalMode === "create") {
        const createNews = await NewsService.create({
          title: form.title,
          content: form.content,
          image: form.image,
          product_ids: form.product_ids,
        });
        newsId = createNews.id;
        setMessage("✅ Thêm tin tức thành công!");
      } else {
        await NewsService.update(editingId, {
          title: form.title,
          content: form.content,
          image: form.image,
        });

        newsId = editingId;

        const oldDetails = await NewsDetailService.getByNewsId(newsId);
        for (const detail of oldDetails) {
          await NewsDetailService.delete(detail.id);
        }

        for (const productId of form.product_ids) {
          await NewsDetailService.create({
            news_id: newsId,
            product_id: productId,
          });
        }

        setMessage("✅ Cập nhật tin tức thành công!");
      }

      closeModal();
      fetchNews(page, search);
    } catch (error) {
      console.error("❌ Submit error:", error);
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Bạn có chắc chắn muốn xóa tin tức này?")) return;

    setLoading(true);
    try {
      await NewsService.delete(id);
      setMessage("✅ Xóa tin tức thành công!");
      fetchNews(page, search);
    } catch (error) {
      console.error(" Delete error:", error);
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== PAGINATION =====
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage && newPage !== page && !loading) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    setSearch(searchValue);
    setPage(1);
  };

  // ===== LOADING STATE =====
  if (loadingData) {
    return (
      <div className="loading-state">
        <div className="loading-text">🔄 Đang tải dữ liệu...</div>
      </div>
    );
  }

  // ===== RENDER DETAIL MODAL =====
  const renderDetailModal = () => (
    <div className="news-detail-modal">
      <div className="news-detail-header">
        <h3>{selectedNews?.title}</h3>
        <div className="news-meta">
          <span className="meta-item">
            📅 {formatDate(selectedNews?.createdAt)}
          </span>
          <span className="meta-item">
            🛍️ {getProductNames(selectedNews?.product_ids)}
          </span>
        </div>
      </div>

      {selectedNews?.image && (
        <div className="news-image-container">
          <img
            src={selectedNews.image}
            alt={selectedNews.title}
            className="news-detail-image"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
        </div>
      )}

      <div className="news-content">
        <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
          {selectedNews?.content}
        </p>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className="news-container">
      {/* Message Alert */}
      {message && (
        <div
          className={`message ${message.includes("✅") ? "success" : "error"}`}
        >
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="header">
        <h2>📰 Quản lý tin tức</h2>
        <button
          className="btn btn-success"
          onClick={openCreateModal}
          disabled={loading}
        >
          ➕ Thêm tin tức
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-info">
          Tổng <strong>{totalItems}</strong> tin tức
        </div>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            name="search"
            className="search-input"
            placeholder="Tìm kiếm tin tức..."
            defaultValue={search}
          />
          <button type="submit" className="btn-search">
            🔍 Tìm kiếm
          </button>
        </form>
      </div>

      {/* News Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Hình ảnh</th>
              <th>Nội dung</th>
              <th>Sản phẩm liên quan</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  🔄 Đang tải...
                </td>
              </tr>
            ) : newsList.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999",
                  }}
                >
                  📦 Không có tin tức nào
                </td>
              </tr>
            ) : (
              newsList.map((news) => (
                <tr key={news.id}>
                  <td className="table-id">#{news.id}</td>
                  <td className="news-title">
                    <div style={{ maxWidth: "300px" }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "#333",
                        }}
                      >
                        {news.title || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="news-image">
                    {news.image ? (
                      <img
                        src={news.image}
                        alt={news.title}
                        style={{
                          width: "80px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x50?text=No+Image";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "80px",
                          height: "50px",
                          backgroundColor: "#f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "4px",
                          fontSize: "20px",
                        }}
                      >
                        📷
                      </div>
                    )}
                  </td>
                  <td className="news-excerpt">
                    <div
                      style={{
                        maxWidth: "250px",
                        fontSize: "13px",
                        color: "#666",
                        lineHeight: 1.5,
                      }}
                    >
                      {getExcerpt(news.content, 80)}
                    </div>
                  </td>
                  <td className="news-products">
                    <div
                      style={{
                        maxWidth: "200px",
                        fontSize: "12px",
                        color: "#555",
                      }}
                    >
                      {getProductNames(news.product_ids)}
                    </div>
                  </td>
                  <td className="date">{formatDate(news.createdAt)}</td>
                  <td className="actions">
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => openDetailModal(news)}
                        disabled={loading}
                        style={{
                          background: "#17a2b8",
                          borderColor: "#17a2b8",
                        }}
                      >
                        👁️ Xem
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => openEditModal(news)}
                        disabled={loading}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(news.id)}
                        disabled={loading}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Trang {page} / {totalPage} - Tổng {totalItems} tin tức
          </div>
          <div className="pagination-controls">
            <button
              className="btn-nav"
              onClick={() => handlePageChange(1)}
              disabled={page === 1 || loading}
            >
              ⏪ Đầu
            </button>
            <button
              className="btn-nav"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
            >
              ⬅️ Trước
            </button>

            {Array.from({ length: Math.min(5, totalPage) }, (_, i) => {
              const pageNum = page - 2 + i;
              if (pageNum < 1 || pageNum > totalPage) return null;
              return (
                <button
                  key={pageNum}
                  className={`btn-page ${page === pageNum ? "active" : ""}`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="btn-nav"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPage || loading}
            >
              Tiếp ➡️
            </button>
            <button
              className="btn-nav"
              onClick={() => handlePageChange(totalPage)}
              disabled={page === totalPage || loading}
            >
              Cuối ⏩
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        show={showModal}
        onClose={closeModal}
        title={
          modalMode === "create"
            ? "➕ Thêm tin tức mới"
            : `✏️ Chỉnh sửa tin tức #${editingId}`
        }
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">📝 Tiêu đề *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? "error" : ""}`}
              placeholder="Nhập tiêu đề tin tức..."
              required
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">🖼️ Hình ảnh (URL)</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className={`form-input ${errors.image ? "error" : ""}`}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
            {errors.image && <span className="form-error">{errors.image}</span>}
            {form.image && (
              <div>
                <img
                  src={form.image}
                  alt="Preview"
                  className="news-image-preview"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=Invalid+Image";
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">📋 Nội dung *</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className={`form-input ${errors.content ? "error" : ""}`}
              rows="8"
              placeholder="Nhập nội dung tin tức..."
              required
            />
            {errors.content && (
              <span className="form-error">{errors.content}</span>
            )}
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              {form.content.length} / 5000 ký tự
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">🛍️ Sản phẩm liên quan</label>
            <select
              multiple
              value={form.product_ids}
              onChange={handleProductsChange}
              className="form-input"
              style={{ minHeight: "150px" }}
            >
              {products.length === 0 ? (
                <option disabled>Đang tải sản phẩm...</option>
              ) : (
                products.map((product) => (
                  <option key={product.id} value={product.id}>
                    [{product.id}] {product.name}
                  </option>
                ))
              )}
            </select>
            <div className="select-hint">
              💡 Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều sản phẩm
            </div>
            {form.product_ids.length > 0 && (
              <div className="selected-products">
                <strong>Đã chọn {form.product_ids.length} sản phẩm:</strong>{" "}
                {getProductNames(form.product_ids)}
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
              disabled={loading}
            >
              ❌ Hủy
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading
                ? "⏳ Đang xử lý..."
                : modalMode === "edit"
                ? "💾 Cập nhật"
                : "➕ Thêm mới"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onClose={closeModal}
        title="📰 Chi tiết tin tức"
        size="lg"
      >
        {renderDetailModal()}
      </Modal>
    </div>
  );
}

export default NewsManagement;
