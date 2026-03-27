import React, { useState, useEffect, useRef } from "react";
import BannerService from "@services/banner.service.js";
import ProductService from "@services/product.service.js";
import "@styles/pages/_homepage.scss";
import CategoryService from "@services/category.service.js";
import Footer from "@components/common/Footer.jsx";
import Header from "@components/common/Header.jsx";
import NewsService from "@services/news.service.js";
import BestSellerGrid from "@components/common/BestSellerGrid";
import { scrollToTop, navigation, formatDate } from "@utils/editorHelpers";
import {
  Flame,
  X,
  SearchIcon,
  Calendar,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import useProductSuggestion from "../../hooks/useProductSuggestion";
import Image from "@components/common/Image";

export default function HomePage({
  user,
  onLogout,
  isGuest = false,
  onLogin,
  onRegister,
}) {
  const wrapperRef = useRef(null);
  //Resolve conflict with search suggestion hook
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { suggestions = [], loadingSearch } = useProductSuggestion(query);
  const [activeIndex, setActiveIndex] = useState(-1);

  const onChangeSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setOpen(!!value.trim());
    setActiveIndex(-1);
    console.log("Query changed:", query);
    console.log("Suggestions products:", suggestions);
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
    setOpen(false);

    if (item.id) {
      navigation(`product/${item.id}`);
      scrollToTop();
      return;
    }

    setSearch(item.name);
    setPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [news, setNews] = useState([]);
  const headerRef = React.useRef();
  const [newsLoading, setNewsLoading] = useState(true);

  //  PAGINATION STATES
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");

  // FILTER STATES
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState({});
  const [message, setMessage] = useState("");
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
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const response = await NewsService.getPaging({
          page: 1,
          search: "",
          pageSize: 3,
        });

        console.log("News API response:", response);

        const newsData = response.data || [];
        setNews(newsData);
      } catch (error) {
        setNews([
          {
            id: 1,
            title: "Khám phá hương vị cà phê đặc biệt mùa thu",
            content: "Mùa thu đến, thưởng thức những ly cà phê ấm áp...",
            image:
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (newsItem) => {
    window.location.hash = `news/${newsItem.id}`;
    scrollToTop();
  };

  const handleViewAllNews = () => {
    window.location.hash = "news";
    scrollToTop();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        let response;
        if (selectedCategory === "all") {
          response = await ProductService.getPaging({
            page: page || 1,
            search: search || "",
          });
        } else {
          response = await ProductService.getByCategory(selectedCategory, {
            page: page || 1,
            search: search || "",
          });
        }

        console.log("API Products:", response);

        if (!response || !response.data) {
          setProducts([]);
          setTotalPage(1);
          setTotalItems(0);
          return;
        }

        const productsData = response.data || [];
        const pagination = response.pagination || {};

        const transformedProducts = productsData.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          image: product.image,
          category_id: product.category_id,
          brand_id: product.brand_id || null,
          price:
            product.product_details && product.product_details.length > 0
              ? product.product_details[0].price
              : 0,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }));

        setProducts(transformedProducts);
        setPage(pagination.currentPage || page || 1);
        setTotalPage(pagination.totalPage || 1);
        setTotalItems(pagination.totalItems || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Không thể tải danh sách sản phẩm");

        setProducts([
          {
            id: 1,
            name: "Cà phê đen đá",
            description: "Cà phê truyền thống Việt Nam, đậm đà hương vị",
            image:
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&q=80&fit=crop",
            category_id: 1,
            brand_id: null,
            price: 25000,
          },
          {
            id: 2,
            name: "Cappuccino",
            description: "Cà phê Ý với lớp foam sữa mịn màng",
            image:
              "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&q=80&fit=crop",
            category_id: 1,
            brand_id: 1,
            price: 45000,
          },
        ]);
        setTotalPage(1);
        setTotalItems(2);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [page, search, selectedCategory]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      const categoryId = parseInt(selectedCategory);
      const filtered = products.filter((product) => {
        return product.category_id === categoryId;
      });
      setFilteredProducts(filtered);
    }
  }, [products, selectedCategory]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await BannerService.getAll();

        let bannersData = [];

        if (response && response.success && Array.isArray(response.data)) {
          bannersData = response.data;
        } else if (response && Array.isArray(response.data)) {
          bannersData = response.data;
        } else if (Array.isArray(response)) {
          bannersData = response;
        }

        setBanners(Array.isArray(bannersData) ? bannersData : []);
        setError("");
      } catch (error) {
        console.error("❌ Error fetching banners:", error);
        setError("Không thể tải banner");
        setBanners([
          {
            id: 1,
            name: "HG Coffee",
            title: "HG Coffee",
            subtitle: "Khám phá hương vị đặc biệt",
            description:
              "Trải nghiệm không gian thư giãn với những thức uống chất lượng cao",
            image:
              "https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f",
            buttonText: "Khám phá ngay",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    handleViewProduct(product);
  };
  const handleViewProduct = (product) => {
    navigation(`product/${product.id}`);
    scrollToTop();
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
    e.preventDefault(); //Chặn reload trang khi nhấn nút submit search
    setSearch(query.trim()); //Cập nhật state search với giá trị đã trim
    setOpen(false); //Đóng gợi ý khi submit
    setPage(1); // Reset về trang 1 khi search
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
    setSearch("");
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      return `${getCategoryIcon(categoryId)} ${category.name}`;
    }

    // Fallback với icon
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
      1: "☕", // Cà phê
      2: "🍵", // Trà
      3: "🥖", // Bánh mì
      4: "🧊", // Đá xay
      8: "☕", // Latte
      10: "🧋", // Trà sữa
    };
    return iconMap[categoryId] || "🍽️";
  };

  if (loading) {
    return (
      <div className="homepage-loading">
        <div className="loading-spinner">☕</div>
        <p>Đang tải...</p>
      </div>
    );
  }
  return (
    <div className="homepage">
      <Header
        user={user}
        onLogout={onLogout}
        currentPage="home"
        isGuest={isGuest}
        onLogin={onLogin}
        onRegister={onRegister}
      />

      {message && (
        <div
          className={`message-notification ${
            message.includes("✅") ? "success" : "error"
          }`}
        >
          {message}
          <button onClick={() => setMessage("")} className="close-message">
            ×
          </button>
        </div>
      )}

      <section className="hero-slider">
        <div className="slider-container">
          {banners.map((banner, index) => (
            <div
              key={banner.id || index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
            >
              <div className="slide-background">
                <p
                  style={{
                    fontSize: "11px",
                    color: "white",
                  }}
                >
                  Hình ảnh chỉ mang tính chất học thuật. Không sử dụng với mục
                  đích thương mại{" "}
                </p>
                <img
                  src={banner.image}
                  alt={banner.title || "Banner"}
                  onError={(e) => {
                    const fallbackImages = [
                      "https://images.unsplash.com/photo-1507226983735-a4af7b65e7c3?w=1400&h=700&q=80&fit=crop",
                      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1400&h=700&q=80&fit=crop",
                      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&h=700&q=80&fit=crop",
                    ];
                    e.target.src =
                      fallbackImages[index % fallbackImages.length];
                  }}
                />
                <div className="slide-overlay"></div>
              </div>
              <div className="slide-content">
                <div className="content-wrapper">
                  <div className="slide-visual">
                    <div className="product-showcase"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {banners.length > 1 && (
          <>
            <button className="slider-btn prev-btn" onClick={prevSlide}>
              <span>‹</span>
            </button>
            <button className="slider-btn next-btn" onClick={nextSlide}>
              <span>›</span>
            </button>
            <div className="slider-pagination">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`pagination-dot ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <span className="dot-number">{index + 1}</span>
                </button>
              ))}
            </div>
            <div className="slider-progress">
              <div
                className="progress-bar"
                style={{
                  width: `${((currentSlide + 1) / banners.length) * 100}%`,
                }}
              />
            </div>
          </>
        )}
      </section>

      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">SẢN PHẨM NỔI BẬT</h2>
            <p className="section-subtitle">
              Khám phá những thức uống được yêu thích nhất tại HG Coffee
            </p>

            <div className="search-bar" ref={wrapperRef}>
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <input
                  name="search"
                  className="search-input"
                  value={query}
                  onChange={onChangeSearch}
                  onFocus={() => query.trim() && setOpen(true)}
                  onKeyDown={(e) => {
                    if (!open || suggestions.length === 0) return;

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        prev < suggestions.length - 1 ? prev + 1 : 0,
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        prev > 0 ? prev - 1 : suggestions.length - 1,
                      );
                    } else if (e.key === "Enter" && activeIndex >= 0) {
                      e.preventDefault();
                      handleSelectSuggestion(suggestions[activeIndex]);
                    } else if (e.key === "Escape") {
                      setOpen(false);
                    }
                  }}
                  placeholder={
                    selectedCategory === "all"
                      ? "Tìm kiếm sản phẩm..."
                      : `Tìm trong ${getCategoryName(parseInt(selectedCategory)).replace(/^[^\s]+\s/, "")}...`
                  }
                  autoComplete="off"
                />

                <button type="submit" className="btn-search">
                  <SearchIcon size={16} className="search-icon" />
                  <p className="search-text">Tìm kiếm</p>
                </button>

                <div className="div-clear-search">
                  {(query || search) && (
                    <button
                      type="button"
                      className="btn-clear-search"
                      onClick={() => {
                        setQuery("");
                        setSearch("");
                        setPage(1);
                        setOpen(false);
                        setActiveIndex(-1);
                      }}
                      title="Xóa tìm kiếm"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>

              {open && query.trim().length >= 2 && (
                <div
                  className={`search-suggest-dropdown ${open ? "open" : ""}`}
                >
                  {loadingSearch ? (
                    <div className="suggest-state">Đang gợi ý...</div>
                  ) : suggestions.length === 0 ? (
                    <div className="suggest-state">Không có gợi ý phù hợp</div>
                  ) : (
                    suggestions.map((item, index) => (
                      <button
                        key={item.id || `${item.name}-${index}`}
                        type="button"
                        className={`suggest-item ${activeIndex === index ? "active" : ""}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => handleSelectSuggestion(item)}
                      >
                        <div className="suggest-info">
                          <div className="suggest-name">{item.name}</div>
                          <div className="suggest-price">
                            {formatPrice(item.product_details?.[0]?.price)}
                          </div>
                        </div>

                        <div className="suggest-image">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={36}
                            height={36}
                            borderRadius={5}
                          />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

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
            <div className="filter-status-all">
              {selectedCategory !== "all" && (
                <div className="filter-status">
                  <span className="filter-indicator">
                    Đang lọc theo:{" "}
                    <strong>
                      {getCategoryName(parseInt(selectedCategory))}
                    </strong>
                  </span>
                  <button
                    className="clear-filter-btn"
                    onClick={() => handleCategoryFilter("all")}
                    title="Xóa bộ lọc"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {productsLoading ? (
            <div className="products-loading">
              <div className="loading-spinner">☕</div>
              <p>Đang tải menu...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">📭</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>
                {selectedCategory === "all"
                  ? "Không có sản phẩm nào khớp với từ khóa tìm kiếm của bạn."
                  : `Không có sản phẩm nào trong danh mục "${getCategoryName(
                      parseInt(selectedCategory),
                    ).replace(/^[^\s]+\s/, "")}".`}
              </p>
              {selectedCategory !== "all" && (
                <button
                  className="reset-filter-btn"
                  onClick={() => handleCategoryFilter("all")}
                >
                  Xem tất cả sản phẩm
                </button>
              )}
            </div>
          ) : (
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
                      <button className="quick-view-btn" title="Xem chi tiết">
                        👁️
                      </button>
                    </div>
                    <div className="product-badge">
                      <Flame size={12} />
                      <span>Hot</span>
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
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart[product.id]}
                      >
                        <span className="btn-text">
                          {addingToCart[product.id]
                            ? "Đang thêm..."
                            : isGuest
                              ? "Xem chi tiết"
                              : "Xem chi tiết"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!productsLoading && products.length > 0 && totalPage > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Trang {page} / {totalPage}
                {selectedCategory !== "all" && (
                  <span>
                    {" "}
                    (danh mục:{" "}
                    {getCategoryName(parseInt(selectedCategory)).replace(
                      /^[^\s]+\s/,
                      "",
                    )}
                    )
                  </span>
                )}
              </div>
              <div className="pagination-controls">
                <button
                  className="btn-nav"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || productsLoading}
                >
                  <ArrowLeft size={14} />
                </button>

                {Array.from({ length: Math.min(5, totalPage) }, (_, i) => {
                  const startPage = Math.max(1, page - 2);
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
                })}

                <button
                  className="btn-nav"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPage || productsLoading}
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <BestSellerGrid
        limit={5}
        onProductClick={handleViewProduct}
        onViewMore={() => (window.location.hash = "menu?sort=bestseller")}
        formatPrice={formatPrice}
        getCategoryName={getCategoryName}
        title="SẢN PHẨM BÁN CHẠY"
      />

      <section className="news-section-home">
        <div className="container">
          <div className="section-header">
            <div className="header-content">
              <span className="section-badge">TIN TỨC MỚI NHẤT</span>
              <h2 className="section-title">Câu chuyện HG Coffee</h2>
              <p className="section-subtitle">
                Khám phá những câu chuyện thú vị về cà phê, văn hóa thưởng thức
                và những điều mới mẻ từ HG Coffee
              </p>
            </div>
            <button className="btn-view-all" onClick={handleViewAllNews}>
              <span>Xem tất cả</span>
              <span className="arrow">→</span>
            </button>
          </div>

          {newsLoading ? (
            <div className="news-loading">
              <div className="loading-spinner">📰</div>
              <p>Đang tải tin tức...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="no-news">
              <div className="no-news-icon">📭</div>
              <p>Chưa có tin tức nào</p>
            </div>
          ) : (
            <div className="news-grid">
              {news.map((item, index) => (
                <article
                  key={item.id}
                  className={`news-card ${index === 0 ? "featured" : ""}`}
                  onClick={() => handleNewsClick(item)}
                >
                  <div className="news-image">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&q=80&fit=crop";
                      }}
                    />
                    <div className="news-overlay">
                      <div className="news-badge">
                        {index === 0 ? "🔥 Nổi bật" : "📰 Tin mới"}
                      </div>
                    </div>
                  </div>

                  <div className="news-content">
                    <div className="news-meta">
                      <span className="news-date">
                        <Calendar size={13} className="news-calendar-icon" />{" "}
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <h3 className="news-title">{item.title}</h3>

                    <button className="btn-read-more">
                      <span className="text-read-more">Đọc thêm</span>
                      <span className="icon">→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
