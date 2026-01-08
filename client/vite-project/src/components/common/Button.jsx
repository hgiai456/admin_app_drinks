import PropTypes from "prop-types";
import "@styles/components/_button.scss";

/**
 * Button Component - Tái sử dụng với nhiều variants
 * @param {Object} props
 * @param {string} props.variant - Loại button: 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning'
 * @param {string} props.size - Kích thước: 'sm' | 'md' | 'lg'
 * @param {boolean} props.disabled - Vô hiệu hóa button
 * @param {boolean} props.loading - Hiển thị loading spinner
 * @param {boolean} props.fullWidth - Chiếm toàn bộ chiều rộng
 * @param {React.ReactNode} props.icon - Icon hiển thị trước text
 * @param {React.ReactNode} props.children - Nội dung button
 * @param {function} props.onClick - Handler khi click
 * @param {string} props.type - Loại button: 'button' | 'submit' | 'reset'
 * @param {string} props.className - Custom class
 */
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  children,
  onClick,
  type = "button",
  className = "",
  ...rest
}) {
  const buttonClass = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && "btn--full-width",
    loading && "btn--loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="btn__spinner">
          <svg className="spinner" viewBox="0 0 50 50">
            <circle
              className="spinner-path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            />
          </svg>
        </span>
      )}
      {!loading && icon && <span className="btn__icon">{icon}</span>}
      <span className="btn__text">{children}</span>
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "info",
    "warning",
    "outline-primary",
    "outline-secondary",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
};

export default Button;
