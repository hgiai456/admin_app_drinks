import { useState, useEffect } from "react";
import CartService from "@services/cart.service.js";
import CartButton from "@components/customer/CartButton";
import { SignalIcon, User, UserPlus } from "lucide-react";
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
    <header className="homepage-header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-container">
            <img
              src="https://storage.googleapis.com/hg-store-a11c5.firebasestorage.app/media-library/1769589733524-logo-hg-coffee%20-%20no-background.png"
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
            href="https://www.google.com/maps/dir//Viva+Coffee+Vi%E1%BB%87t+Nam,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh,+Qu%E1%BA%ADn+11,+%C4%90%C6%B0%E1%BB%9Dng+S%E1%BB%91+5+-+C%C6%B0+x%C3%A1+B%C3%ACnh+Th%E1%BB%9Bi,+1+%C4%90%C6%B0%E1%BB%9Dng+S%E1%BB%91+6/@10.75844,106.6642979,3422m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x31752f13ff393833:0x787900586abf310e!2m2!1d106.6494609!2d10.7613216?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D"
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
            href="https://www.facebook.com/hoa.giai.826653"
            className={`nav-link ${currentPage === "contact" ? "active" : ""}`}
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
              href="#https://www.google.com/maps/place/B%E1%BB%87nh+vi%E1%BB%87n+L%C3%A3nh+Binh+Th%C4%83ng/@10.7605704,106.6433577,856m/data=!3m1!1e3!4m16!1m9!4m8!1m0!1m6!1m2!1s0x31752f13ff393833:0x787900586abf310e!2zVml2YSBDb2ZmZWUgVmnhu4d0IE5hbSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBRdeG6rW4gMTEsIMSQxrDhu51uZyBT4buRIDUgLSBDxrAgeMOhIELDrG5oIFRo4bubaSwgMSDEkMaw4budbmcgU-G7kSA2!2m2!1d106.6494609!2d10.7613216!3m5!1s0x31752f90d969433b:0x9bd571c18375e5b0!8m2!3d10.7605706!4d106.6481212!16s%2Fg%2F11s4zm877d?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D"
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
      </div>
    </header>
  );
}
