import { useEffect, useState } from "react";
import { getExcerpt } from "@utils/editorHelpers.js";

function NewsCard({ news, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (news.image) {
      const img = new Image();
      img.src = news.image;
      img.onload = () => setImageLoaded(true);
    }
  }, [news.image]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Get category badge (fake for demo)
  const getCategoryBadge = () => {
    const categories = ["New"];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  return (
    <article className="news-card" onClick={() => onClick(news)}>
      {/* Image Container */}
      <div className="news-card-image">
        {news.image ? (
          <>
            {!imageLoaded && (
              <div className="image-skeleton">
                <div className="skeleton-shimmer"></div>
              </div>
            )}
            <img
              src={news.image}
              alt={news.title}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src =
                  "https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f";
              }}
              style={{ display: imageLoaded ? "block" : "none" }}
            />
          </>
        ) : (
          <div className="image-placeholder">
            <span className="placeholder-icon">📰</span>
            <span className="placeholder-text">HG COFFEE</span>
          </div>
        )}

        <div className="category-badge">{getCategoryBadge()}</div>
      </div>

      <div className="news-card-content">
        <div className="news-meta">
          <span className="meta-category">{getCategoryBadge()}</span>
          <span className="meta-date">{formatDate(news.createdAt)}</span>
        </div>

        <h3 className="news-title">{news.title}</h3>
        <button className="read-more">
          <span>Đọc thêm</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default NewsCard;
