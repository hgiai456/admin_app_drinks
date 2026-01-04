const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3003/api";

export const ENDPOINTS = {
  // ===== AUTH =====
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },

  // ===== USERS =====
  USERS: {
    BASE: "/users",
    BY_ID: (id) => `/users/${id}`,
    PROFILE: "/users/profile",
  },

  // ===== PRODUCTS =====
  PRODUCTS: {
    BASE: "/products",
    ALL: "/products/all",
    BY_ID: (id) => `/products/${id}`,
    BY_CATEGORY: "/products/by-category",
    CUSTOMIZE_PAGE: "/products/customize-page",
  },

  // ===== CATEGORIES =====
  CATEGORIES: {
    BASE: `${API_BASE_URL}/categories`,
    ALL: `${API_BASE_URL}/categories/all`, // ✅ PHẢI CÓ DÒNG NÀY
    BY_ID: (id) => `${API_BASE_URL}/categories/${id}`,
  },

  // ===== BRANDS =====
  BRANDS: {
    BASE: `${API_BASE_URL}/brands`,
    ALL: `${API_BASE_URL}/brands/all`,
    BY_ID: (id) => `${API_BASE_URL}/brands/${id}`,
  },

  // ===== ORDERS =====
  ORDERS: {
    BASE: "/orders",
    BY_ID: (id) => `/orders/${id}`,
    BY_USER: (userId) => `/orders/user/${userId}`,
    DETAILS: {
      BASE: "/orders/details/all",
      BY_ID: (id) => `/orders/details/${id}`,
    },
  },

  // ===== CARTS =====
  CARTS: {
    BASE: "/carts",
    BY_ID: (id) => `/carts/${id}`,
    BY_SESSION: "/carts/by-session",
    BY_USER: (userId) => `/carts/user/${userId}`,
    CHECKOUT: "/carts/checkout",
    CLEAR: (id) => `/carts/${id}/clear`,
    ITEMS: {
      BASE: "/carts/items",
      ALL: "/carts/items/all",
      BY_ID: (id) => `/carts/items/${id}`,
      BY_CART: (cartId) => `/carts/items/cart/${cartId}`,
    },
  },

  // ===== STORES =====
  STORES: {
    BASE: "/stores",
    BY_ID: (id) => `/stores/${id}`,
  },

  // ===== SIZES =====
  SIZES: {
    BASE: "/sizes",
    BY_ID: (id) => `/sizes/${id}`,
  },

  // ===== BANNERS =====
  BANNERS: {
    BASE: "/banners",
    BY_ID: (id) => `/banners/${id}`,
    DETAILS: {
      BASE: "/banners/details/all",
      BY_ID: (id) => `/banners/details/${id}`,
    },
  },

  // ===== PRODETAILS =====
  PRODETAILS: {
    BASE: "/prodetails",
    BY_ID: (id) => `/prodetails/${id}`,
    BY_PRODUCT: "/prodetails/by-product",
    FIND: "/prodetails/find",
  },

  // ===== PAYMENTS =====
  PAYMENTS: {
    CREATE: "/payments/create",
    VERIFY: "/payments/verify",
    STATUS: (orderId) => `/payments/status/${orderId}`,
    VNPAY: {
      RETURN: "/payments/vnpay/return",
      IPN: "/payments/vnpay/ipn",
    },
    PAYOS: {
      WEBHOOK: "/payments/payos/webhook",
    },
  },

  // ===== IMAGES =====
  IMAGES: {
    UPLOAD: "/images/upload",
    UPLOAD_GOOGLE: "/images/google/upload",
    DELETE: "/images/delete",
    VIEW: (fileName) => `/images/${fileName}`,
    PRODUCTS: {
      BASE: "/images/products/all",
      BY_ID: (id) => `/images/products/${id}`,
    },
  },
};

export default ENDPOINTS;
