import { useState, useEffect } from "react";
import ProductService from "@services/product.service.js";
import CategoryService from "@services/category.service.js";
import Layout from "@components/common/Layout.jsx";
import "@styles/pages/_homepage.scss";
import { formatPrice, scrollToTop } from "@utils/editorHelpers.js";
import { ShoppingCart } from "lucide-react";

export default function ProductPage({
  user,
  onLogout,
  isGuest = false,
  onLogin,
  onRegister,
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pageSize, setPageSize] = useState(4);
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

  const pageSizeOptions = [
    { value: 4, label: "4 sản phẩm" },
    { value: 8, label: "8 sản phẩm" },
    { value: 12, label: "12 sản phẩm" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getAll();
        let categoriesData = [];
        if (response && response.data && Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (Array.isArray(response)) {
          categoriesData = response;
        }

        setCategories(categoriesData || []);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
        setCategories([
          { id: 1, name: "Cà phê" },
          { id: 2, name: "Trà" },
          { id: 3, name: "Bánh mì" },
          { id: 4, name: "Đá xay" },
          { id: 8, name: "Latte" },
          { id: 10, name: "Trà sữa" },
        ]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setError("");

        let response;

        console.log("🔄 Fetching products:", {
          selectedCategory,
          page,
          pageSize,
          search,
        });

        if (selectedCategory === "all") {
          response = await ProductService.getCustomizePage({
            page: page,
            search: search,
            pageSize: pageSize,
          });
        } else {
          response = await ProductService.getByCategory(selectedCategory, {
            page: page,
            search: search,
            limit: pageSize,
          });
        }

        console.log("📦 Raw API response:", response);

        if (!response) {
          console.error("❌ Response is null/undefined");
          setProducts([]);
          setTotalPage(1);
          setTotalProducts(0);
          return;
        }

        const productsData = response.data || [];
        const pagination = response.pagination || {};

        console.log("📊 Pagination from API:", pagination);

        const transformedProducts = productsData.map((product) => {
          let price = 0;

          if (
            product.product_details &&
            Array.isArray(product.product_details) &&
            product.product_details.length > 0
          ) {
            const firstDetail = product.product_details[0];
            if (firstDetail && typeof firstDetail.price === "number") {
              price = firstDetail.price;
            }
          }

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            image: product.image,
            category_id: product.category_id,
            brand_id: product.brand_id || null,
            price: price,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          };
        });

        setProducts(transformedProducts);
        setTotalPage(pagination.totalPage);
        setTotalProducts(
          pagination.totalProducts || transformedProducts.length,
        );

        if (pagination.currentPage && pagination.currentPage !== page) {
          setPage(pagination.currentPage);
        }

        console.log("✅ Products loaded:", {
          count: transformedProducts.length,
          totalPage: pagination.totalPage,
          totalProducts: pagination.totalProducts,
          currentPage: pagination.currentPage,
        });
      } catch (error) {
        setError("Không thể tải sản phẩm: " + error.message);
        setProducts([]);
        setTotalPage(1);
        setTotalProducts(0);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [page, search, selectedCategory, pageSize]);

  const handlePageSizeChange = (newPageSize) => {
    console.log("📏 Changing page size to:", newPageSize);
    setPageSize(newPageSize);
    setPage(1); // Reset về trang 1
    setShowPageSizeDropdown(false);
  };

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= totalPage &&
      newPage !== page &&
      !productsLoading
    ) {
      setPage(newPage);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchTerm = formData.get("search") || "";
    console.log("🔍 Searching:", searchTerm);
    setSearch(searchTerm);
    setPage(1);
  };

  const handleCategoryFilter = (categoryId) => {
    console.log("🏷️ Filtering by category:", categoryId);
    setSelectedCategory(categoryId);
    setPage(1);
    setSearch("");
  };

  const handleViewProduct = (product) => {
    window.location.hash = `product/${product.id}`;
    scrollToTop();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      return `${getCategoryIcon(categoryId)} ${category.name}`;
    }

    const categoryMap = {
      1: "☕ Cà phê",
      2: "🍵 Trà",
      3: "🥖 Bánh mì",
      4: "🧊 Đá xay",
      8: "☕ Latte",
      10: "🧋 Trà sữa",
    };
    return categoryMap[categoryId] || "🍽️ Thức uống";
  };

  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      1: "☕",
      2: "🍵",
      3: "🥖",
      4: "🧊",
      8: "☕",
      10: "🧋",
    };
    return iconMap[categoryId] || "🍽️";
  };

  useEffect(() => {
    console.log("📊 State updated:", {
      products: products.length,
      page,
      totalPage,
      totalProducts,
      selectedCategory,
      pageSize,
    });
  }, [products, page, totalPage, totalProducts, selectedCategory, pageSize]);

  return (
    <Layout
      user={user}
      onLogout={onLogout}
      currentPage="menu"
      isGuest={isGuest}
      onLogin={onLogin}
      onRegister={onRegister}
    >
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button className="error-close" onClick={() => setError("")}>
            ✖️
          </button>
        </div>
      )}

      <section className="products-section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">THỰC ĐƠN SẢN PHẨM</h2>
            <p className="section-subtitle">
              Khám phá toàn bộ bộ sưu tập thức uống đặc biệt tại HG Coffee
            </p>

            {/* SEARCH BAR */}
            <div className="search-bar">
              <div className="search-info">
                {selectedCategory === "all" ? (
                  <>
                    Tổng <strong>{totalProducts}</strong> sản phẩm - Trang{" "}
                    <strong>{page}</strong>/{totalPage}
                  </>
                ) : (
                  <>
                    Danh mục{" "}
                    <strong>
                      {getCategoryName(parseInt(selectedCategory)).replace(
                        /^[^\s]+\s/,
                        "",
                      )}
                    </strong>
                    : <strong>{totalProducts}</strong> sản phẩm
                    {totalPage > 1 && (
                      <>
                        {" "}
                        - Trang <strong>{page}</strong>/{totalPage}
                      </>
                    )}
                  </>
                )}
                <span className="page-size-info">
                  | Hiển thị <strong>{pageSize}</strong> sản phẩm/trang
                </span>
              </div>
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <input
                  name="search"
                  className="search-input"
                  placeholder="Tìm kiếm sản phẩm..."
                  defaultValue={search}
                />
                <button type="submit" className="btn-search">
                  🔍 Tìm kiếm
                </button>
                {search && (
                  <button
                    type="button"
                    className="btn-clear-search"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    title="Xóa tìm kiếm"
                  >
                    ✖️
                  </button>
                )}
              </form>
            </div>

            {/* PAGE SIZE DROPDOWN */}
            {/* <div className="page-size-dropdown-container">
              <span className="selector-label">📄 Số sản phẩm mỗi trang:</span>
              <div className="page-size-dropdown">
                <button
                  className="page-size-dropdown-trigger"
                  onClick={() => setShowPageSizeDropdown(!showPageSizeDropdown)}
                  type="button"
                >
                  <span className="current-size">
                    {pageSize} sản phẩm/trang
                  </span>
                  <span
                    className={`dropdown-arrow ${
                      showPageSizeDropdown ? "open" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {showPageSizeDropdown && (
                  <div className="page-size-dropdown-menu">
                    {pageSizeOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`dropdown-item ${
                          pageSize === option.value ? "active" : ""
                        }`}
                        onClick={() => handlePageSizeChange(option.value)}
                      >
                        <span className="item-text">{option.label}</span>
                        {pageSize === option.value && (
                          <span className="check-mark">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div> */}

            {/* CATEGORY FILTERS */}
            <div className="section-actions">
              <button
                className={`filter-btn ${
                  selectedCategory === "all" ? "active" : ""
                }`}
                onClick={() => handleCategoryFilter("all")}
              >
                <span>🍽️ Tất cả</span>
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`filter-btn ${
                    selectedCategory === category.id.toString() ? "active" : ""
                  }`}
                  onClick={() => handleCategoryFilter(category.id.toString())}
                >
                  <span>
                    {getCategoryIcon(category.id)} {category.name}
                  </span>
                </button>
              ))}
            </div>

            {/* FILTER STATUS */}
            {selectedCategory !== "all" && (
              <div className="filter-status">
                <span className="filter-indicator">
                  🎯 Đang lọc theo:{" "}
                  <strong>{getCategoryName(parseInt(selectedCategory))}</strong>
                </span>
                <button
                  className="clear-filter-btn"
                  onClick={() => handleCategoryFilter("all")}
                  title="Xóa bộ lọc"
                >
                  ✖️ Bỏ lọc
                </button>
              </div>
            )}
          </div>

          {/* PRODUCTS GRID */}
          {productsLoading ? (
            <div className="products-loading">
              <div className="loading-spinner">☕</div>
              <p>Đang tải thực đơn...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">📭</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>
                {search
                  ? `Không có sản phẩm nào khớp với từ khóa "${search}"`
                  : selectedCategory !== "all"
                    ? `Không có sản phẩm nào trong danh mục này`
                    : "Không có sản phẩm nào"}
              </p>
              {(search || selectedCategory !== "all") && (
                <button
                  className="reset-filter-btn"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setPage(1);
                  }}
                >
                  ↺ Xem tất cả sản phẩm
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                className={`products-grid ${
                  products.length <= 3 ? "few-products" : ""
                }`}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleViewProduct(product)}
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
                        <button
                          className="quick-view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct(product);
                          }}
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                      </div>
                      <div className="product-badge">
                        <span>🔥 Hot</span>
                      </div>
                    </div>

                    <div className="product-info">
                      <div className="product-category">
                        {getCategoryName(product.category_id)}
                      </div>
                      <h3 className="product-name">{product.name}</h3>

                      <div className="product-footer">
                        <div className="product-price">
                          <span className="current-price">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <button
                          className="add-to-cart-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct(product);
                          }}
                        >
                          <ShoppingCart size={16} className="btn-icon" />
                          <span>Thêm</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pagination">
                <div className="pagination-info">
                  <span>
                    Hiển thị{" "}
                    <strong>
                      {Math.min((page - 1) * pageSize + 1, totalProducts)}-
                      {Math.min(page * pageSize, totalProducts)}
                    </strong>{" "}
                    / <strong>{totalProducts}</strong> sản phẩm
                  </span>
                  {totalPage > 1 && (
                    <span>
                      {" "}
                      • Trang <strong>{page}</strong> /{" "}
                      <strong>{totalPage}</strong>
                    </span>
                  )}
                </div>

                {totalPage > 1 && (
                  <div className="pagination-controls">
                    <button
                      className="btn-nav"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1 || productsLoading}
                      title="Trang trước"
                    >
                      ⬅️ Trước
                    </button>

                    {/* Page numbers */}
                    <div className="page-numbers">
                      {Array.from(
                        { length: Math.min(5, totalPage) },
                        (_, i) => {
                          let startPage = Math.max(1, page - 2);
                          if (page > totalPage - 2) {
                            startPage = Math.max(1, totalPage - 4);
                          }
                          const pageNum = startPage + i;
                          if (pageNum > totalPage) return null;

                          return (
                            <button
                              key={pageNum}
                              className={`btn-page ${page === pageNum ? "active" : ""}`}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={productsLoading}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <button
                      className="btn-nav"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPage || productsLoading}
                      title="Trang sau"
                    >
                      Tiếp ➡️
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
