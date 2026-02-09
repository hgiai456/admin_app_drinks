/**
 * Sanitize HTML content để tránh XSS attacks
 * @param {string} html - HTML content cần sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHtml(html) {
  if (!html) return "";

  // Basic sanitization - remove dangerous tags and attributes
  let sanitized = html;

  // Remove script tags
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove event handlers (onclick, onerror, etc)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "");

  return sanitized;
}

/**
 * Scroll lên đầu trang với smooth animation
 * @param {number} duration - Thời gian scroll (ms), mặc định 300ms
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

/**
 * Get excerpt from HTML content
 * @param {string} html - HTML content
 * @param {number} maxLength - Maximum length of excerpt
 * @returns {string} - Plain text excerpt
 */
export function getExcerpt(html, maxLength = 150) {
  if (!html) return "";

  // Remove HTML tags
  const plainText = html.replace(/<[^>]*>/g, "").trim();

  // Truncate if needed
  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength) + "...";
}

/**
 * Count words in HTML content
 * @param {string} html - HTML content
 * @returns {number} - Word count
 */
export function countWords(html) {
  if (!html) return 0;

  const plainText = html.replace(/<[^>]*>/g, "").trim();
  if (!plainText) return 0;

  return plainText.split(/\s+/).length;
}

/**
 * Check if HTML content is empty (no text, only HTML tags)
 * @param {string} html - HTML content
 * @returns {boolean} - True if empty
 */
export function isEmptyContent(html) {
  if (!html) return true;

  const plainText = html.replace(/<[^>]*>/g, "").trim();
  return plainText.length === 0;
}

/**
 * Strip all HTML tags from content
 * @param {string} html - HTML content
 * @returns {string} - Plain text
 */
export function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hour}:${minute}`;
}

export function formatPrice(price) {
  if (!price || price === 0) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export const navigation = (hash) => {
  window.location.hash = hash;
  scrollToTop();
};
