const API_BASE_URL = "http://localhost:3003/api";

export const ENDPOINTS = {
  // ===== AUTH =====
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },

  // ===== USERS =====
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
    PROFILE: `${API_BASE_URL}/users/profile`,
  },

  // ===== NEWS =====
  NEWS: {
    BASE: `${API_BASE_URL}/news`,
    BY_ID: (id) => `${API_BASE_URL}/news/${id}`,
  },

  NEWSDETAILS: {
    BASE: `${API_BASE_URL}/news-details`,
    BY_ID: (id) => `${API_BASE_URL}/news-details/${id}`,
  },

  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    ALL: `${API_BASE_URL}/products/all`,
    BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
    BY_CATEGORY: `${API_BASE_URL}/products/by-category`,
    CUSTOMIZE_PAGE: `${API_BASE_URL}/products/customize-page`,
  },

  CATEGORIES: {
    BASE: `${API_BASE_URL}/categories`,
    ALL: `${API_BASE_URL}/categories/all`,
    BY_ID: (id) => `${API_BASE_URL}/categories/${id}`,
  },

  // ===== BRANDS =====
  BRANDS: {
    BASE: `${API_BASE_URL}/brands`,
    ALL: `${API_BASE_URL}/brands/all`,
    BY_ID: (id) => `${API_BASE_URL}/brands/${id}`,
  },

  MEDIA_LIBRARY: {
    BASE: `${API_BASE_URL}/media-library`,
    BY_ID: (id) => `${API_BASE_URL}/media-library/${id}`,
    UPLOAD: `${API_BASE_URL}/media-library/upload`,
    INCREMENT_USAGE: `${API_BASE_URL}/media-library/increment-usage`,
    UPLOAD_MULTIPLE: `${API_BASE_URL}/media-library/upload-multiple`,
  },

  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
    BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
    BY_USER: (userId) => `${API_BASE_URL}/orders/user/${userId}`,
    DETAILS: {
      BASE: `${API_BASE_URL}/orders/details/all`,
      BY_ID: (id) => `${API_BASE_URL}/orders/details/${id}`,
    },
  },

  // ===== CARTS =====
  CARTS: {
    BASE: `${API_BASE_URL}/carts`,
    BY_ID: (id) => `${API_BASE_URL}/carts/${id}`,
    BY_SESSION: `${API_BASE_URL}/carts/by-session`,
    BY_USER: (userId) => `${API_BASE_URL}/carts/user/${userId}`,
    CHECKOUT: `${API_BASE_URL}/carts/checkout`,
    CLEAR: (id) => `${API_BASE_URL}/carts/${id}/clear`,
    ITEMS: {
      BASE: `${API_BASE_URL}/carts/items`,
      ALL: `${API_BASE_URL}/carts/items/all`,
      BY_ID: (id) => `${API_BASE_URL}/carts/items/${id}`,
      BY_CART: (cartId) => `${API_BASE_URL}/carts/items/cart/${cartId}`,
    },
  },

  STORES: {
    BASE: `${API_BASE_URL}/stores`,
    BY_ID: (id) => `${API_BASE_URL}/stores/${id}`,
  },

  SIZES: {
    BASE: `${API_BASE_URL}/sizes`,
    BY_ID: (id) => `${API_BASE_URL}/sizes/${id}`,
  },

  BANNERS: {
    BASE: `${API_BASE_URL}/banners`,
    BY_ID: (id) => `${API_BASE_URL}/banners/${id}`,
    DETAILS: {
      BASE: `${API_BASE_URL}/banners/details/all`,
      BY_ID: (id) => `${API_BASE_URL}/banners/details/${id}`,
    },
  },

  // ===== PRODETAILS =====
  PRODETAILS: {
    BASE: `${API_BASE_URL}/prodetails`,
    BY_ID: (id) => `${API_BASE_URL}/prodetails/${id}`,
    BY_PRODUCT: `${API_BASE_URL}/prodetails/by-product`,
    FIND: `${API_BASE_URL}/prodetails/find`,
  },

  // ===== PAYMENTS =====
  PAYMENTS: {
    CREATE: `${API_BASE_URL}/payments/create`,
    VERIFY: `${API_BASE_URL}/payments/verify`,
    STATUS: (orderId) => `${API_BASE_URL}/payments/status/${orderId}`,
    VNPAY: {
      RETURN: `${API_BASE_URL}/payments/vnpay/return`,
      IPN: `${API_BASE_URL}/payments/vnpay/ipn`,
    },
    PAYOS: {
      WEBHOOK: `${API_BASE_URL}/payments/payos/webhook`,
    },
  },

  // ===== IMAGES =====
  IMAGES: {
    UPLOAD: `${API_BASE_URL}/images/upload`,
    UPLOAD_GOOGLE: `${API_BASE_URL}/images/google/upload`,
    DELETE: `${API_BASE_URL}/images/delete`,
    VIEW: (fileName) => `${API_BASE_URL}/images/${fileName}`,
    PRODUCTS: {
      BASE: `${API_BASE_URL}/images/products/all`,
      BY_ID: (id) => `${API_BASE_URL}/images/products/${id}`,
    },
  },
};

export default ENDPOINTS;
