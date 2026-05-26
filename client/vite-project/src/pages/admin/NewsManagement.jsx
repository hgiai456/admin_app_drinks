import { useEffect, useState } from "react";
import NewsService from "@services/news.service.js";
import NewsDetailService from "@services/newsdetail.service.js";
import ProductService from "@services/product.service.js";
import News from "@models/news.js";
import Modal from "@components/admin/ModelComponent.jsx";
import Button from "@components/common/Button.jsx";
import Image from "@components/common/Image.jsx";

import "@styles/pages/_admin.scss";
import "@styles/pages/_news.scss";
import { Image as ImageIcon, Newspaper } from "lucide-react";
import ImagePicker from "@components/admin/ImagePicker";
import WysiwygEditor from "@components/admin/WysiwygEditor.jsx";
import { useWysiwygEditor } from "@hooks/useWysiwygEditor.js";
import {
  sanitizeHtml,
  getExcerpt as getHtmlExcerpt,
} from "@utils/editorHelpers.js";
import Loading from "../../components/common/Loading";

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
  const [showImagePicker, setShowImagePicker] = useState(false);

  const editorHook = useWysiwygEditor("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    product_ids: [],
  });

  // Helper Functions
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

  const handleImageSelect = (imagePath) => {
    setForm((prev) => ({ ...prev, image: imagePath }));
    setShowImagePicker(false);
  };

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

  // Fetch Data
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
              `Error loading news-details for news ${news.id}:`,
              error,
            );
            return { ...news, product_ids: [] };
          }
        }),
      );

      setNewsList(newsWithProducts);
      setTotalPage(result.pagination.totalPage);
      setTotalItems(result.pagination.totalItems);
      setPage(result.pagination.currentPage);
    } catch (error) {
      console.error("Error fetching news:", error);
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
      console.error("Error loading products:", error);
      setMessage("⚠️ Không thể tải danh sách sản phẩm");
    }
  };

  // UseEffect
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchNews(page, search);
  }, [page, search]);

  // Modal Handlers
  const openCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    editorHook.reset();
    setForm({ title: "", content: "", image: "", product_ids: [] });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = async (news) => {
    setModalMode("edit");
    setEditingId(news.id);

    try {
      const newsDetails = await NewsDetailService.getByNewsId(news.id);
      const relatedProductIds = newsDetails.map((detail) => detail.product_id);

      setForm({
        title: news.title || "",
        content: news.content || "",
        image: news.image || "",
        product_ids: relatedProductIds,
      });

      editorHook.setContent(news.content || "");
    } catch (error) {
      console.error("Error loading news details:", error);
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
    editorHook.reset();
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
      parseInt(option.value),
    );
    setForm((prev) => ({ ...prev, product_ids: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editorHook.isEmpty()) {
        setErrors({ content: "Nội dung không được để trống" });
        setLoading(false);
        return;
      }

      if (editorHook.getTextLength() > 10000) {
        setErrors({ content: "Nội dung không được vượt quá 10000 ký tự" });
        setLoading(false);
        return;
      }
      const newsData = new News({
        ...form,
        content: sanitizeHtml(editorHook.content),
      });

      const validation = newsData.validate();

      if (!validation.isValid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }

      if (modalMode === "create") {
        const payload = {
          title: form.title,
          content: sanitizeHtml(editorHook.content),
          image: form.image,
          product_ids: form.product_ids,
        };

        await NewsService.create(payload);
        setMessage("✅ Thêm tin tức thành công!");
      } else {
        await NewsService.update(editingId, {
          title: form.title,
          content: sanitizeHtml(editorHook.content),
          image: form.image,
        });

        const oldDetails = await NewsDetailService.getByNewsId(editingId);
        for (const detail of oldDetails) {
          await NewsDetailService.delete(detail.id);
        }

        for (const productId of form.product_ids) {
          await NewsDetailService.create({
            news_id: editingId,
            product_id: productId,
          });
        }

        setMessage("✅ Cập nhật tin tức thành công!");
      }

      closeModal();
      fetchNews(page, search);
    } catch (error) {
      if (error.response) {
        console.error("📍 Response status:", error.response.status);
        console.error("📍 Response data:", error.response.data);
        console.error("📍 Response headers:", error.response.headers);

        // Display backend error message
        const errorMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          error.message;
        setMessage(`❌ ${errorMsg}`);
      } else if (error.request) {
        setMessage("❌ Không nhận được phản hồi từ server");
      } else {
        setMessage("❌ " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Bạn có chắc chắn muốn xóa tin tức này?")) return;

    setLoading(true);
    try {
      const newsDetails = await NewsDetailService.getByNewsId(id);
      for (const detail of newsDetails) {
        await NewsDetailService.delete(detail.id);
      }

      await NewsService.delete(id);
      setMessage("✅ Xóa tin tức thành công!");
      fetchNews(page, search);
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
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

  const handleEditorChange = (content) => {
    editorHook.handleChange(content);
    setForm((prev) => ({ ...prev, content: sanitizeHtml(content) }));
    // Clear error nếu có
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: "" }));
    }
  };

  const getExcerpt = (htmlContent, maxLength = 100) => {
    return getHtmlExcerpt(htmlContent, maxLength);
  };

  // Render Detail Modal
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
              e.target.src =
                "https://via.placeholder.com/800x400?text=No+Image";
            }}
          />
        </div>
      )}

      <div
        className="news-content"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(selectedNews?.content || ""),
        }}
      />
    </div>
  );

  // Main Render
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
        <div className="header-title">
          <Newspaper size={30} className="header-icon" />
          <h2>Quản lý tin tức</h2>
        </div>

        <Button
          variant="success"
          size="md"
          onClick={openCreateModal}
          disabled={loading}
          icon={<span>➕ Thêm tin tức</span>}
        ></Button>
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
          <Button type="submit" variant="primary" size="sm">
            🔍 Tìm kiếm
          </Button>
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
                <td colSpan="8" style={{ padding: "0" }}>
                  <Loading variant="skeleton" rows={8} cols={8} />
                </td>
              </tr>
            ) : newsList.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">
                  📦 Không có tin tức nào
                </td>
              </tr>
            ) : (
              newsList.map((news) => (
                <tr key={news.id}>
                  <td className="table-id">#{news.id}</td>
                  <td className="news-title">
                    <div className="title-wrapper">
                      <div className="title-text">{news.title || "-"}</div>
                    </div>
                  </td>
                  <td className="news-image">
                    <div className="image-wrapper">
                      {news.image ? (
                        <img
                          src={news.image}
                          alt={news.title}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/80x50?text=No+Image";
                          }}
                        />
                      ) : (
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f"
                          alt="No Image"
                        />
                      )}
                    </div>
                  </td>
                  <td className="news-excerpt">
                    <div className="excerpt-text">
                      {getExcerpt(news.content, 80)}
                    </div>
                  </td>
                  <td className="news-products">
                    <div className="products-text">
                      {getProductNames(news.product_ids)}
                    </div>
                  </td>
                  <td className="date">{formatDate(news.createdAt)}</td>
                  <td className="actions">
                    <div className="action-buttons">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => openDetailModal(news)}
                        disabled={loading}
                      >
                        👁️ Xem
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openEditModal(news)}
                        disabled={loading}
                      >
                        ✏️ Sửa
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(news.id)}
                        disabled={loading}
                      >
                        🗑️ Xóa
                      </Button>
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
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={page === 1 || loading}
            >
              ⏪ Đầu
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
            >
              ⬅️ Trước
            </Button>

            {Array.from({ length: Math.min(5, totalPage) }, (_, i) => {
              const pageNum = page - 2 + i;
              if (pageNum < 1 || pageNum > totalPage) return null;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                  className={page === pageNum ? "active" : ""}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPage || loading}
            >
              Tiếp ➡️
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(totalPage)}
              disabled={page === totalPage || loading}
            >
              Cuối ⏩
            </Button>
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
            <label className="form-label">🖼️ Hình ảnh</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className={`form-input ${errors.image ? "error" : ""}`}
                placeholder="URL hình ảnh..."
                type="url"
                style={{ flex: 1 }}
              />
              <Button
                type="button"
                variant="primary"
                size="md"
                icon={<ImageIcon size={18} />}
                onClick={() => setShowImagePicker(true)}
              >
                Chọn từ thư viện
              </Button>
            </div>
            {errors.image && <span className="form-error">{errors.image}</span>}
            {form.image && (
              <div style={{ marginTop: "12px" }}>
                <Image
                  src={form.image}
                  alt="Preview"
                  width={200}
                  height={200}
                  borderRadius={8}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">📋 Nội dung *</label>
            <WysiwygEditor
              value={editorHook.content}
              onChange={handleEditorChange}
              placeholder="Nhập nội dung tin tức... (Hỗ trợ định dạng, ảnh, video)"
              minHeight={200}
              disabled={loading}
            />
            {errors.content && (
              <span className="form-error">{errors.content}</span>
            )}
            <div className="char-count">
              {form.content.length} / 10000 ký tự
            </div>
          </div>
          {modalMode !== "edit" ? (
            <div className="form-group">
              <label className="form-label">🛍️ Sản phẩm liên quan</label>
              <select
                multiple
                value={form.product_ids}
                onChange={handleProductsChange}
                className="form-input"
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
          ) : null}

          <div className="form-buttons">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={closeModal}
              disabled={loading}
            >
              ❌ Hủy
            </Button>
            <Button
              type="submit"
              variant="success"
              size="md"
              loading={loading}
              disabled={loading}
            >
              {modalMode === "edit" ? "💾 Cập nhật" : "➕ Thêm mới"}
            </Button>
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

      <ImagePicker
        show={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
        currentImage={form.image}
      />
    </div>
  );
}

export default NewsManagement;
