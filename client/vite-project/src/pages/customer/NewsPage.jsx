import { useState, useEffect, useRef } from "react";
import NewsService from "@services/news.service.js";
import NewsCard from "@components/customer/NewsCard.jsx";
import Layout from "@components/common/Layout.jsx";
import "@styles/pages/_newspage.scss";

function NewsPage({ user, onLogout, isGuest = false, onLogin, onRegister }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  const observerTarget = useRef(null);

  // ===== FETCH NEWS =====
  const fetchNews = async (pageNumber = 1, append = false) => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      console.log(`🔄 Fetching news - page: ${pageNumber}`);

      const res = await NewsService.getPaging({
        page: pageNumber,
        search: "",
      });

      const newsData = res.data || [];
      const pagination = res.pagination || {};

      console.log("📦 API Response:", {
        newsCount: newsData.length,
        currentPage: pagination.currentPage,
        totalPage: pagination.totalPage,
        append: append,
      });

      if (append) {
        // ✅ APPEND: Thêm vào cuối danh sách (loại bỏ duplicate)
        setNewsList((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = newsData.filter((item) => !existingIds.has(item.id));
          console.log(
            `✅ Appending ${newItems.length} new items (filtered ${
              newsData.length - newItems.length
            } duplicates)`
          );
          return [...prev, ...newItems];
        });
      } else {
        // ✅ REPLACE: Thay thế toàn bộ danh sách
        setNewsList(newsData);
        console.log(`✅ Replaced with ${newsData.length} items`);
      }

      setTotalPage(pagination.totalPage || 1);

      // ✅ Check if has more pages
      if (pageNumber >= (pagination.totalPage || 1)) {
        setHasMore(false);
        console.log("🏁 No more pages to load");
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("❌ Error fetching news:", error);
      setError("Không thể tải tin tức. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // ===== INITIAL LOAD =====
  useEffect(() => {
    fetchNews(1, false);
  }, []);

  // ===== INFINITE SCROLL OBSERVER =====
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          console.log(`👀 Reached bottom, loading page ${nextPage}...`);
          setPage(nextPage);
          fetchNews(nextPage, true); // ← Load next page và append
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, page]);

  // ===== HANDLE NEWS CLICK =====
  const handleNewsClick = (news) => {
    console.log("📰 Clicked news:", news);
    window.location.hash = `news/${news.id}`;
  };

  // ===== SCROLL TO TOP =====
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout
      user={user}
      onLogout={onLogout}
      currentPage="news"
      isGuest={isGuest}
      onLogin={onLogin}
      onRegister={onRegister}
    >
      <div className="news-page">
        {/* HERO SECTION */}
        <section className="news-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">📰 TIN TỨC HG COFFEE</h1>
              <p className="hero-subtitle">
                Cập nhật những tin tức mới nhất về cà phê, trà và văn hóa thưởng
                thức
              </p>
            </div>
          </div>
        </section>

        {/* NEWS GRID */}
        <section className="news-section">
          <div className="container">
            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* News Grid */}
            {newsList.length === 0 && !loading ? (
              <div className="empty-state">
                <span className="empty-icon">📰</span>
                <h3>Chưa có tin tức nào</h3>
                <p>Hãy quay lại sau để đọc những tin tức mới nhất!</p>
              </div>
            ) : (
              <>
                <div className="news-grid">
                  {newsList.map((news) => (
                    <NewsCard
                      key={news.id}
                      news={news}
                      onClick={handleNewsClick}
                    />
                  ))}
                </div>

                {/* Loading Indicator */}
                {loading && (
                  <div className="loading-more">
                    <div className="spinner"></div>
                    <span>Đang tải thêm tin tức...</span>
                  </div>
                )}

                {/* Intersection Observer Target */}
                {hasMore && !loading && (
                  <div ref={observerTarget} className="observer-target" />
                )}

                {/* End Message */}
                {!hasMore && newsList.length > 0 && (
                  <div className="end-message">
                    <span>🎉 Bạn đã xem hết tất cả tin tức!</span>
                    <button className="btn-scroll-top" onClick={scrollToTop}>
                      ⬆️ Lên đầu trang
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default NewsPage;
