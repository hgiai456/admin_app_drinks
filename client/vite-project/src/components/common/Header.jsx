import { useState, useEffect } from "react";
import CartService from "@services/cart.service.js";
import CartButton from "@components/customer/CartButton";
import "@styles/pages/_header.scss";

export default function Header({
  user,
  onLogout,
  currentPage = "home",
  onCartCountChange,
  isGuest = false,
  onLogin,
  onRegister,
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    loadCartCount();
  }, [user, isGuest]);

  useEffect(() => {
    const handleCartRefresh = () => {
      loadCartCount();
    };
    window.addEventListener("refreshCartCount", handleCartRefresh);
    return () => {
      window.removeEventListener("refreshCartCount", handleCartRefresh);
    };
  }, [user, isGuest]);

  const handleLoginClick = () => {
    console.log("🔄 Guest login clicked, onLogin:", onLogin);
    if (onLogin) {
      onLogin();
    } else {
      console.warn("⚠️ No onLogin handler provided");
      alert("Chức năng đăng nhập đang được phát triển.");
    }
  };

  const handleRegisterClick = () => {
    console.log("🔄 Guest register clicked, onRegister:", onRegister);
    if (onRegister) {
      onRegister();
    } else if (onLogin) {
      onLogin();
    } else {
      console.warn("⚠️ No onRegister/onLogin handler provided");
      alert("Chức năng đăng ký đang được phát triển.");
    }
  };

  const handleEditProfile = () => {
    alert("Chức năng chỉnh sửa thông tin đang được phát triển.");
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  const loadCartCount = async () => {
    setCartLoading(true);
    try {
      const userId = user?.id || null;
      const count = await CartService.getCartItemCount(userId);
      setCartItemCount(count);
      console.log(
        `📊 Cart count loaded: ${count} (${userId ? "user" : "guest"})`
      );
    } catch (error) {
      console.error("❌ Error loading cart count:", error);
      setCartItemCount(0);
    } finally {
      setCartLoading(false);
    }
  };

  const handleNavigation = (hash) => {
    window.location.hash = hash;
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    if (isGuest && cartItemCount === 0) {
      alert("Giỏ hàng trống. Vui lòng thêm sản phẩm để xem giỏ hàng!");
      return;
    }
    handleNavigation("cart");
    loadCartCount();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="homepage-header">
      <div className="header-container">
        {/* ✅ LOGO SECTION - LUÔN Ở TRÊN (DESKTOP + MOBILE) */}
        <div className="logo-section">
          <div className="logo-container">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f"
              alt="HG COFFEE"
              className="logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div className="brand-info">
            <h1 className="brand-name">HG COFFEE</h1>
            <span className="brand-subtitle">COFFEE & TEA HOUSE</span>
          </div>
        </div>

        {/* ✅ NAV (DESKTOP - FLEXBOX CENTER) */}
        <nav className="main-nav">
          <a
            href="#home"
            className={`nav-link ${currentPage === "home" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "home";
            }}
          >
            TRANG CHỦ
          </a>
          <a
            href="#menu"
            className={`nav-link ${currentPage === "menu" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "menu";
            }}
          >
            MENU
          </a>
          <a
            href="#store"
            className={`nav-link ${currentPage === "store" ? "active" : ""}`}
          >
            CỬA HÀNG
          </a>
          <a
            href="#news"
            className={`nav-link ${currentPage === "news" ? "active" : ""}`}
          >
            TIN TỨC
          </a>
          <a
            href="#contact"
            className={`nav-link ${currentPage === "contact" ? "active" : ""}`}
          >
            VỀ CHÚNG TÔI
          </a>
        </nav>

        {/* ✅ ACTIONS (DESKTOP - FLEXBOX RIGHT) */}
        <div className="header-actions">
          <CartButton
            cartItemCount={cartItemCount}
            currentPage={currentPage}
            onCartClick={handleCartClick}
            variant="default"
            onRefreshCount={loadCartCount}
            loading={cartLoading}
            isGuest={isGuest}
          />

          {user && !isGuest ? (
            <div className="user-section">
              <div
                className="user-dropdown"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  <span>{user?.username?.charAt(0).toUpperCase() || "U"}</span>
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name || "User"}</span>
                  <span className="user-role">Khách hàng</span>
                </div>
                <div className="dropdown-arrow">▼</div>
              </div>

              {showUserMenu && (
                <div className="user-menu">
                  <button className="menu-item" onClick={handleEditProfile}>
                    <span>Chỉnh sửa thông tin</span>
                  </button>
                  <button className="menu-item logout" onClick={handleLogout}>
                    <span>Đăng xuất</span>
                  </button>
                  <button
                    className="menu-item logout"
                    onClick={() => {
                      window.location.hash = "orders";
                      setShowUserMenu(false);
                    }}
                  >
                    <span>Danh sách đơn hàng</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-section">
              <button className="auth-btn login-btn" onClick={handleLoginClick}>
                <span className="btn-icon">👤</span>
                <span>Đăng nhập</span>
              </button>
              <button
                className="auth-btn register-btn"
                onClick={handleRegisterClick}
              >
                <span className="btn-icon">📝</span>
                <span>Đăng ký</span>
              </button>
            </div>
          )}
        </div>

        {/* ✅ NAV + ACTIONS WRAPPER (CHỈ MOBILE/TABLET) */}
        <div className="nav-actions-wrapper">
          <nav className="main-nav">
            <a
              href="#home"
              className={`nav-link ${currentPage === "home" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "home";
              }}
            >
              TRANG CHỦ
            </a>
            <a
              href="#menu"
              className={`nav-link ${currentPage === "menu" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "menu";
              }}
            >
              MENU
            </a>
            <a
              href="#store"
              className={`nav-link ${currentPage === "store" ? "active" : ""}`}
            >
              CỬA HÀNG
            </a>
            <a
              href="#news"
              className={`nav-link ${currentPage === "news" ? "active" : ""}`}
            >
              TIN TỨC
            </a>
            <a
              href="#contact"
              className={`nav-link ${
                currentPage === "contact" ? "active" : ""
              }`}
            >
              VỀ CHÚNG TÔI
            </a>
          </nav>

          <div className="header-actions">
            <CartButton
              cartItemCount={cartItemCount}
              currentPage={currentPage}
              onCartClick={handleCartClick}
              variant="default"
              onRefreshCount={loadCartCount}
              loading={cartLoading}
              isGuest={isGuest}
            />

            {user && !isGuest ? (
              <div className="user-section">
                <div
                  className="user-dropdown"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    <span>
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user?.name || "User"}</span>
                    <span className="user-role">Khách hàng</span>
                  </div>
                  <div className="dropdown-arrow">▼</div>
                </div>

                {showUserMenu && (
                  <div className="user-menu">
                    <button className="menu-item" onClick={handleEditProfile}>
                      <span>Chỉnh sửa thông tin</span>
                    </button>
                    <button className="menu-item logout" onClick={handleLogout}>
                      <span>Đăng xuất</span>
                    </button>
                    <button
                      className="menu-item logout"
                      onClick={() => {
                        window.location.hash = "orders";
                        setShowUserMenu(false);
                      }}
                    >
                      <span>Danh sách đơn hàng</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-section">
                <button
                  className="auth-btn login-btn"
                  onClick={handleLoginClick}
                >
                  <span className="btn-icon">👤</span>
                  <span>Đăng nhập</span>
                </button>
                <button
                  className="auth-btn register-btn"
                  onClick={handleRegisterClick}
                >
                  <span className="btn-icon">📝</span>
                  <span>Đăng ký</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
