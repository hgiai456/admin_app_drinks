import { useEffect } from "react";
import "@styles/components/_alert-message.scss";

export default function AlertMessage({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    if (!message) return;
    if (duration === 0) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`alert-message ${type}`}>
      <span className="alert-icon">
        {type === "success" && "✅"}
        {type === "error" && "❌"}
      </span>
      <span className="alert-text">{message}</span>
      <button className="alert-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
