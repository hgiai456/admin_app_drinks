/**
 * 🔧 VALIDATION UTILITIES
 * Các hàm validation tái sử dụng cho toàn dự án
 */

// ============================================
// 📧 EMAIL VALIDATION
// ============================================

export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return { isValid: false, message: "Email là bắt buộc" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Email không hợp lệ" };
  }

  return { isValid: true, message: "" };
};

// ============================================
// 📱 PHONE VALIDATION
// ============================================

export const validatePhone = (phone) => {
  if (!phone || phone.trim() === "") {
    return { isValid: false, message: "Số điện thoại là bắt buộc" };
  }

  // Loại bỏ khoảng trắng và dấu -
  const cleanPhone = phone.replace(/[\s-]/g, "");

  // Regex cho số điện thoại VN: 10-11 số, bắt đầu bằng 0
  const phoneRegex = /^0\d{9,10}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      message: "Số điện thoại phải bắt đầu bằng 0 và có 10-11 số",
    };
  }

  return { isValid: true, message: "" };
};

// ============================================
// 🔒 PASSWORD VALIDATION
// ============================================

export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecialChar = false,
  } = options;

  if (!password || password.trim() === "") {
    return { isValid: false, message: "Mật khẩu là bắt buộc" };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Mật khẩu phải có ít nhất ${minLength} ký tự`,
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Mật khẩu phải chứa ít nhất 1 chữ hoa",
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Mật khẩu phải chứa ít nhất 1 chữ thường",
    };
  }

  if (requireNumber && !/\d/.test(password)) {
    return {
      isValid: false,
      message: "Mật khẩu phải chứa ít nhất 1 chữ số",
    };
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
    };
  }

  return { isValid: true, message: "" };
};

// ============================================
// ✅ CONFIRM PASSWORD
// ============================================

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === "") {
    return { isValid: false, message: "Vui lòng xác nhận mật khẩu" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "Mật khẩu xác nhận không khớp" };
  }

  return { isValid: true, message: "" };
};

// ============================================
// 📝 TEXT VALIDATION
// ============================================

export const validateRequired = (value, fieldName = "Trường này") => {
  if (!value || value.toString().trim() === "") {
    return { isValid: false, message: `${fieldName} là bắt buộc` };
  }

  return { isValid: true, message: "" };
};

export const validateMinLength = (
  value,
  minLength,
  fieldName = "Trường này"
) => {
  if (!value || value.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} phải có ít nhất ${minLength} ký tự`,
    };
  }

  return { isValid: true, message: "" };
};

export const validateMaxLength = (
  value,
  maxLength,
  fieldName = "Trường này"
) => {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} không được vượt quá ${maxLength} ký tự`,
    };
  }

  return { isValid: true, message: "" };
};

// ============================================
// 🔢 NUMBER VALIDATION
// ============================================

export const validateNumber = (value, options = {}) => {
  const { min, max, fieldName = "Giá trị" } = options;

  if (value === "" || value === null || value === undefined) {
    return { isValid: false, message: `${fieldName} là bắt buộc` };
  }

  const num = Number(value);

  if (isNaN(num)) {
    return { isValid: false, message: `${fieldName} phải là số` };
  }

  if (min !== undefined && num < min) {
    return {
      isValid: false,
      message: `${fieldName} phải lớn hơn hoặc bằng ${min}`,
    };
  }

  if (max !== undefined && num > max) {
    return {
      isValid: false,
      message: `${fieldName} phải nhỏ hơn hoặc bằng ${max}`,
    };
  }

  return { isValid: true, message: "" };
};

// ============================================
// 💰 PRICE VALIDATION
// ============================================

export const validatePrice = (price, oldPrice = null) => {
  const priceValidation = validateNumber(price, {
    min: 1000,
    max: 10000000,
    fieldName: "Giá",
  });

  if (!priceValidation.isValid) {
    return priceValidation;
  }

  if (
    oldPrice !== null &&
    oldPrice !== "" &&
    Number(oldPrice) <= Number(price)
  ) {
    return {
      isValid: false,
      message: "Giá cũ phải lớn hơn giá hiện tại",
    };
  }

  return { isValid: true, message: "" };
};

// ============================================
// 🌐 URL VALIDATION
// ============================================

export const validateURL = (url, fieldName = "URL") => {
  if (!url || url.trim() === "") {
    return { isValid: false, message: `${fieldName} là bắt buộc` };
  }

  try {
    new URL(url);
    return { isValid: true, message: "" };
  } catch {
    return { isValid: false, message: `${fieldName} không hợp lệ` };
  }
};

// ============================================
// 🎯 VALIDATE FORM
// ============================================

/**
 * Validate toàn bộ form object
 * @param {Object} formData - Object chứa dữ liệu form
 * @param {Object} rules - Object chứa rules cho từng field
 * @returns {Object} - { isValid: boolean, errors: {} }
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = formData[field];

    if (rule.required) {
      const result = validateRequired(value, rule.label || field);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        return;
      }
    }

    if (rule.type === "email") {
      const result = validateEmail(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        return;
      }
    }

    if (rule.type === "phone") {
      const result = validatePhone(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        return;
      }
    }

    if (rule.type === "password") {
      const result = validatePassword(value, rule.options);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        return;
      }
    }

    if (rule.type === "number") {
      const result = validateNumber(value, {
        ...rule.options,
        fieldName: rule.label || field,
      });
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        return;
      }
    }

    if (rule.minLength) {
      const result = validateMinLength(
        value,
        rule.minLength,
        rule.label || field
      );
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        return;
      }
    }

    if (rule.maxLength) {
      const result = validateMaxLength(
        value,
        rule.maxLength,
        rule.label || field
      );
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        return;
      }
    }

    if (rule.custom) {
      const result = rule.custom(value, formData);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

// ============================================
// 📋 EXPORT ALL
// ============================================

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumber,
  validatePrice,
  validateURL,
  validateForm,
};
