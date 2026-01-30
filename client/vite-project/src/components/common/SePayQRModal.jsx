import React, { useState, useEffect, useRef } from "react";
import "@styles/components/_sepay-modal.scss";
import { formatPrice } from "@utils/validationValue.js";
import { scrollToTop } from "@utils/editorHelpers.js";
import PaymentService from "@services/payment.service.js";

export default function SePayQRModal({
  isOpen,
  qrCode,
  sepayInfo,
  orderId,
  amount,
  onClose,
  onPaymentSuccess,
}) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(900);
  const [checking, setChecking] = useState(false);
  const [autoChecking, setAutoChecking] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const pollingRef = useRef(null);

  // Auto polling
  useEffect(() => {
    if (!isOpen || !autoChecking) return;

    const pollPayment = async () => {
      try {
        console.log(`🔄 Auto checking payment... (${checkCount + 1})`);
        const result = await PaymentService.checkSePayPayment(orderId);

        console.log("📦 Poll result:", result);

        if (result.success && result.data?.status === "completed") {
          clearInterval(pollingRef.current);
          setAutoChecking(false);
          setStatusMessage("✅ Thanh toán thành công!");

          if (onPaymentSuccess) {
            onPaymentSuccess(result.data);
          } else {
            window.location.hash = `#payment-result?status=success&orderId=${orderId}&amount=${amount}`;
          }
          scrollToTop();
          onClose();
        } else {
          setCheckCount((prev) => prev + 1);

          if (result.data?.hint) {
            setStatusMessage(result.data.hint);
          } else if (result.message) {
            setStatusMessage(result.message);
          }
        }
      } catch (error) {
        console.error("Poll error:", error);
        // Không dừng polling khi có lỗi
      }
    };

    // Poll mỗi 5 giây
    pollingRef.current = setInterval(pollPayment, 5000);

    // Initial check sau 3 giây
    const initialCheck = setTimeout(pollPayment, 3000);

    return () => {
      clearInterval(pollingRef.current);
      clearTimeout(initialCheck);
    };
  }, [
    isOpen,
    autoChecking,
    orderId,
    onPaymentSuccess,
    amount,
    onClose,
    checkCount,
  ]);

  // Countdown
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleManualCheck = async () => {
    setChecking(true);
    setStatusMessage("Đang kiểm tra...");
    try {
      const result = await PaymentService.checkSePayPayment(orderId);
      console.log("📦 Manual check result:", result);

      if (result.success && result.data?.status === "completed") {
        setStatusMessage("✅ Thanh toán thành công!");
        clearInterval(pollingRef.current);

        if (onPaymentSuccess) {
          onPaymentSuccess(result.data);
        } else {
          window.location.hash = `#payment-result?status=success&orderId=${orderId}&amount=${amount}`;
        }
        onClose();
      } else {
        setStatusMessage(
          result.data?.hint || result.message || "⏳ Chưa nhận được thanh toán",
        );
      }
    } catch (error) {
      console.error("Manual check error:", error);
      setStatusMessage("Đang kiểm tra...");
    } finally {
      setChecking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sepay-modal-overlay" onClick={onClose}>
      <div className="sepay-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>Quét mã QR để thanh toán</h2>
          <div className="countdown">
            <span className="timer">{formatTime(countdown)} </span>
          </div>
        </div>

        <div className="modal-body">
          {/* Status message */}
          {/* {statusMessage && (
            <div
              className={`status-message ${
                statusMessage.includes("✅") ? "success" : ""
              }`}
            >
              {statusMessage}
            </div>
          )} */}

          {/* Auto checking indicator */}
          {autoChecking && (
            <div className="auto-check-indicator">
              <span className="pulse-dot"></span>
              <span>Đang tự động kiểm tra... ({checkCount})</span>
            </div>
          )}

          {/* QR Code */}
          <div className="qr-section">
            <div className="qr-wrapper">
              <img src={qrCode} alt="QR Code thanh toán" />
            </div>
            <p className="qr-instruction">
              Mở app ngân hàng và quét mã QR để thanh toán
            </p>
          </div>

          <div className="or-divider">
            <span>HOẶC</span>
          </div>

          {/* Transfer Info */}
          <div className="transfer-info">
            <h3>Thông tin chuyển khoản</h3>

            <div className="info-row">
              <label>Ngân hàng:</label>
              <div className="info-value">
                <span>{sepayInfo?.bank_name || "TPBank"}</span>
              </div>
            </div>

            <div className="info-row">
              <label>Số tài khoản:</label>
              <div className="info-value">
                <span className="account-number">
                  {sepayInfo?.account_number}
                </span>
                <button
                  className="copy-btn"
                  onClick={() =>
                    copyToClipboard(sepayInfo?.account_number || "")
                  }
                >
                  {copied ? "✓" : "📋"}
                </button>
              </div>
            </div>

            <div className="info-row">
              <label>Tên TK:</label>
              <div className="info-value">
                <span>{sepayInfo?.account_name}</span>
              </div>
            </div>

            <div className="info-row highlight">
              <label>Số tiền:</label>
              <div className="info-value">
                <span className="amount">{formatPrice(amount)}</span>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(amount?.toString() || "")}
                >
                  {copied ? "✓" : "📋"}
                </button>
              </div>
            </div>

            <div className="info-row highlight">
              <label>Nội dung CK:</label>
              <div className="info-value">
                <span className="transfer-content">
                  {sepayInfo?.transfer_content}
                </span>
                <button
                  className="copy-btn"
                  onClick={() =>
                    copyToClipboard(sepayInfo?.transfer_content || "")
                  }
                >
                  {copied ? "✓" : "📋"}
                </button>
              </div>
            </div>

            <div className="warning-box">
              <p>
                ⚠️ <strong>Quan trọng:</strong> Nhập chính xác nội dung{" "}
                <strong>{sepayInfo?.transfer_content}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn-check-payment"
            onClick={handleManualCheck}
            disabled={checking}
          >
            {checking ? "Đang kiểm tra..." : "Kiểm tra thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
}
