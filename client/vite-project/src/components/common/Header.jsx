import { useState, useEffect } from "react";
import CartService from "@services/cart.service.js";
import CartButton from "@components/customer/CartButton";
import { User, UserPlus, Menu, X } from "lucide-react";
import "@styles/pages/_header.scss";
import useScrollHandling from "@hooks/useScrollHandling";
import classNames from "classnames";
import { navigation } from "@utils/editorHelpers.js";

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
  const { scrollPosition } = useScrollHandling();
  const [fixedPosition, setFixedPosition] = useState(false);

  useEffect(() => {
    scrollPosition > 90 ? setFixedPosition(true) : setFixedPosition(false);
  }, [scrollPosition]);

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

  // Khóa scroll khi menu mở
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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
        `📊 Cart count loaded: ${count} (${userId ? "user" : "guest"})`,
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
    <div
      className={classNames("homepage-header", {
        "fixed-top": fixedPosition,
      })}
    >
      <div className="header-container">
        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Mở menu"
        >
          <Menu size={28} />
        </button>

        {/* Desktop Navigation */}
        <nav className="main-nav desktop-nav">
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
              navigation("menu");
            }}
          >
            MENU
          </a>
          <a
            href="#news"
            className={`nav-link ${currentPage === "news" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              navigation("news");
            }}
          >
            TIN TỨC
          </a>
          <a
            href="https://www.facebook.com/hoa.giai.826653"
            className={`nav-link ${currentPage === "contact" ? "active" : ""}`}
          >
            VỀ CHÚNG TÔI
          </a>
        </nav>

        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-container">
            <img
              src="https://storage.googleapis.com/hg-store-a11c5.firebasestorage.app/media-library/1769589733524-logo-hg-coffee%20-%20no-background.png"
              alt="HG COFFEE"
              className="logo"
              href="#home"
              onClick={(e) => {
                window.location.hash = "home";
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Header Actions */}
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
                <span className="btn-icon">
                  <User size={20} />
                </span>
                <span>Đăng nhập</span>
              </button>
              <button
                className="auth-btn register-btn"
                onClick={handleRegisterClick}
              >
                <span className="btn-icon">
                  <UserPlus size={20} />
                </span>
                <span>Đăng ký</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-sidebar${isMenuOpen ? " open" : ""}`}>
        <div className="mobile-sidebar-header">
          <div className="sidebar-logo">
            <img
              src="https://storage.googleapis.com/hg-store-a11c5.firebasestorage.app/media-library/1769589733524-logo-hg-coffee%20-%20no-background.png"
              alt="HG COFFEE"
            />
          </div>
          <button
            className="close-btn"
            onClick={toggleMenu}
            aria-label="Đóng menu"
          >
            <X size={28} />
          </button>
        </div>

        <nav className="mobile-nav-list">
          <a
            href="#menu"
            className={`mobile-nav-item ${currentPage === "menu" ? "active" : ""}`}
            onClick={() => handleNavigation("menu")}
          >
            <span>THỰC ĐƠN</span>
          </a>
          <a
            href="#menu"
            className={`mobile-nav-item ${currentPage === "menu" ? "active" : ""}`}
            onClick={() => handleNavigation("menu")}
          >
            <span>VỀ HG COFFEE</span>
          </a>
          <a href="#stores" className="mobile-nav-item">
            <span>CỬA HÀNG</span>
          </a>
          <a
            href="#news"
            className={`mobile-nav-item ${currentPage === "news" ? "active" : ""}`}
            onClick={() => handleNavigation("news")}
          >
            <span>TIN TỨC</span>
          </a>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div className="mobile-nav-backdrop" onClick={toggleMenu}></div>
      )}
    </div>
  );
}
