import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

// Import các component gốc của bạn
import Store from "./store.jsx";
import Brand from "./brand.jsx";
import Category from "./category.jsx";
import ProdetailComponent from "./prodetailcomponent.jsx";
import BannerComponent from "./bannercomponent.jsx";
import UserComponent from "./usercomponent.jsx";
import ProductComponent from "./productcomponent.jsx";
import SizeComponent from "./sizecomponent.jsx";
import OrderComponent from "./ordercomponent.jsx";
import ImageComponent from "./imagecomponent.jsx";

// Wrapper component để áp dụng styling cho các component của bạn
function StyledComponentWrapper({ children }) {
  return (
    <div className="page-container">
      <div className="component-wrapper">{children}</div>
    </div>
  );
}

const COLORS = {
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  secondary: "#10b981",
  accent: "#f59e0b",
  background: "#f8fafc",
  surface: "#ffffff",
  text: "#1e293b",
  textLight: "#64748b",
  border: "#e2e8f0",
  shadow: "rgba(0, 0, 0, 0.1)",
};

function Header({ currentPage, setCurrentPage }) {
  const pages = [
    { name: "Order", icon: "📋" },
    { name: "Store", icon: "🏪" },
    { name: "Brand", icon: "🏷️" },
    { name: "Category", icon: "📁" },
    { name: "Product", icon: "🛍️" },
    { name: "User", icon: "👥" },
    { name: "Size", icon: "📏" },
    { name: "Banner", icon: "🎨" },
    { name: "Product Detail", icon: "📄" },
    { name: "Image", icon: "🖼️" }, // Thêm tab Image
  ];

  return (
    <header
      style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
        color: COLORS.surface,
        padding: "2rem 1rem",
        borderRadius: "0 0 24px 24px",
        boxShadow: `0 8px 32px ${COLORS.shadow}`,
        marginBottom: "2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            marginBottom: "1.5rem",
            fontWeight: 700,
            fontSize: "2.5rem",
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          🍹 Admin Dashboard
        </h1>
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {pages.map((page) => (
            <button
              key={page.name}
              onClick={() => setCurrentPage(page.name)}
              style={{
                background:
                  currentPage === page.name
                    ? `linear-gradient(135deg, ${COLORS.accent} 0%, #f97316 100%)`
                    : `rgba(255, 255, 255, 0.15)`,
                color:
                  currentPage === page.name ? COLORS.surface : COLORS.surface,
                fontWeight: "600",
                border:
                  currentPage === page.name
                    ? `2px solid ${COLORS.accent}`
                    : "2px solid rgba(255, 255, 255, 0.2)",
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                fontSize: "0.9rem",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transform:
                  currentPage === page.name ? "translateY(-2px)" : "none",
                boxShadow:
                  currentPage === page.name
                    ? "0 4px 12px rgba(0,0,0,0.15)"
                    : "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== page.name) {
                  e.target.style.background = "rgba(255, 255, 255, 0.25)";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page.name) {
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.transform = "none";
                }
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{page.icon}</span>
              {page.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        background: `linear-gradient(135deg, ${COLORS.text} 0%, #374151 100%)`,
        color: COLORS.surface,
        padding: "1.5rem",
        textAlign: "center",
        // Bỏ borderRadius để không tạo bo tròn nổi phía trên
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.9rem",
          opacity: 0.9,
        }}
      >
        © 2025 Admin App Drinks | Made with ❤️
      </p>
    </footer>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState("Order");

  const renderPage = () => {
    switch (currentPage) {
      case "Order":
        return (
          <StyledComponentWrapper>
            <OrderComponent />
          </StyledComponentWrapper>
        );
      case "Store":
        return (
          <StyledComponentWrapper>
            <Store />
          </StyledComponentWrapper>
        );
      case "Brand":
        return (
          <StyledComponentWrapper>
            <Brand />
          </StyledComponentWrapper>
        );
      case "Category":
        return (
          <StyledComponentWrapper>
            <Category />
          </StyledComponentWrapper>
        );
      case "Product":
        return (
          <StyledComponentWrapper>
            <ProductComponent />
          </StyledComponentWrapper>
        );
      case "User":
        return (
          <StyledComponentWrapper>
            <UserComponent />
          </StyledComponentWrapper>
        );
      case "Size":
        return (
          <StyledComponentWrapper>
            <SizeComponent />
          </StyledComponentWrapper>
        );
      case "Banner":
        return (
          <StyledComponentWrapper>
            <BannerComponent />
          </StyledComponentWrapper>
        );
      case "Product Detail":
        return (
          <StyledComponentWrapper>
            <ProdetailComponent />
          </StyledComponentWrapper>
        );
      case "Image":
        return (
          <StyledComponentWrapper
            title="Image Upload"
            description="Upload và quản lý ảnh"
          >
            <ImageComponent />
          </StyledComponentWrapper>
        );
      default:
        return (
          <StyledComponentWrapper>
            <OrderComponent />
          </StyledComponentWrapper>
        );
    }
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${COLORS.background} 0%, #e2e8f0 100%)`,
        minHeight: "100vh",
        paddingBottom: "0px",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <style>
        {`
          .page-container {
            width: 100%;
            margin: 0 auto;
            padding: 0 1rem;
          }
          .component-wrapper {
            background: ${COLORS.surface};
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 4px 20px ${COLORS.shadow};
            border: 1px solid ${COLORS.border};
            margin-top: 1rem;
          }
          
          .component-wrapper > * {
            margin: 0;
          }
          
          /* Style cho các elements con của component */
          .component-wrapper table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
          }
          
          .component-wrapper th,
          .component-wrapper td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid ${COLORS.border};
          }
          
          .component-wrapper th {
            background: ${COLORS.background};
            font-weight: 600;
            color: ${COLORS.text};
          }
          
          .component-wrapper button {
            background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight});
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0.25rem;
          }
          
          .component-wrapper button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px ${COLORS.shadow};
          }
          
          .component-wrapper input,
          .component-wrapper select,
          .component-wrapper textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid ${COLORS.border};
            border-radius: 12px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
            margin: 0.5rem 0;
          }
          
          .component-wrapper input:focus,
          .component-wrapper select:focus,
          .component-wrapper textarea:focus {
            outline: none;
            border-color: ${COLORS.primary};
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          
          .component-wrapper h1,
          .component-wrapper h2,
          .component-wrapper h3,
          .component-wrapper h4,
          .component-wrapper h5,
          .component-wrapper h6 {
            color: ${COLORS.text};
            margin: 1rem 0 0.5rem 0;
          }
          
          .component-wrapper p {
            color: ${COLORS.textLight};
            line-height: 1.6;
            margin: 0.5rem 0;
          }
          
          @media (max-width: 768px) {
            .page-header h2 {
              font-size: 2rem;
            }
            
            .content-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main style={{ padding: "0 1.5rem" }}>{renderPage()}</main>
      <Footer />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
