import React, { useEffect, useState } from "react";
import "@styles/pages/_login.scss";
import {
  isLocked,
  recordFailedAttempt,
  resetAttempts,
  getRemainingAttempts,
  formatLockoutTime,
  getLockoutLevelInfo,
} from "@utils/loginRateLimit";

import { ArrowLeftCircle } from "lucide-react";

export default function LoginAdmin({
  onLogin,
  onSwitchToRegister,
  onGuestMode,
  successMessage,
  onClearMessage,
}) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState({
    locked: false,
    remainingTime: 0,
  });
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  useEffect(() => {
    checkLockoutStatus();
    const interval = setInterval(checkLockoutStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  const checkLockoutStatus = () => {
    const lockStatus = isLocked();
    setLockoutInfo(lockStatus);

    if (!lockStatus.locked) {
      setRemainingAttempts(getRemainingAttempts());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lockStatus = isLocked();
    if (lockStatus.locked) {
      const levelInfo = getLockoutLevelInfo(lockStatus.lockoutLevel - 1);
      setError(
        `🔒 Tài khoản bị khóa do nhập sai quá nhiều lần!\n${levelInfo.message}\nVui lòng thử lại sau ${formatLockoutTime(lockStatus.remainingTime)}`,
      );
      return;
    }

    setError("");
    setLoading(true);
    try {
      let isEmail = false;
      let email;
      for (let i = 0; i < phone.length; i++) {
        if (phone[i] === "@") {
          isEmail = true;
          email = phone;
          break;
        }
      }
      let response;
      if (isEmail) {
        const res = await fetch("https://api.hgcoffee.id.vn/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        response = res;
      } else {
        const res = await fetch("https://api.hgcoffee.id.vn/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        });
        response = res;
      }

      const data = await response.json();
      if (response.ok) {
        const user = data.data?.user;
        const token = data.data?.token;

        resetAttempts();
        setRemainingAttempts(5);

        if (user.role === 2 || user.role === 1) {
          localStorage.setItem("admin_token", token);
          onLogin(user);
        } else {
          const attemptResult = recordFailedAttempt();
          if (attemptResult.locked) {
            const levelInfo = getLockoutLevelInfo(
              attemptResult.lockoutLevel - 1,
            );
            setError(
              `🔒 Bạn đã nhập sai ${5} lần!\n${levelInfo.message}\nTài khoản bị khóa trong ${formatLockoutTime(attemptResult.lockoutDuration)}`,
            );

            setLockoutInfo({
              locked: true,
              remainingTime: attemptResult.lockoutDuration,
              lockoutLevel: attemptResult.lockoutLevel,
            });
          } else {
            setRemainingAttempts(attemptResult.remainingAttempts);
            setError(
              `❌ Tài khoản không có quyền truy cập!\nCòn ${attemptResult.remainingAttempts} lần thử`,
            );
          }
        }
      } else {
        const attemptResult = recordFailedAttempt();

        if (attemptResult.locked) {
          const levelInfo = getLockoutLevelInfo(attemptResult.lockoutLevel - 1);
          setError(
            `🔒 Bạn đã nhập sai ${5} lần!\n${levelInfo.message}\n, chức năng đăng nhập tạm thời bị khóa trong ${formatLockoutTime(attemptResult.lockoutDuration)}`,
          );
          setLockoutInfo({
            locked: true,
            remainingTime: attemptResult.lockoutDuration,
            lockoutLevel: attemptResult.lockoutLevel,
          });
        } else {
          setRemainingAttempts(attemptResult.remainingAttempts);

          if (response.status === 401) {
            setError(
              `Sai mật khẩu!\nCòn ${attemptResult.remainingAttempts} lần thử`,
            );
          } else if (response.status === 404) {
            setError(
              `Tài khoản không tồn tại!\nCòn ${attemptResult.remainingAttempts} lần thử`,
            );
          } else if (response.status === 400) {
            setError(
              <>
                Thông tin đăng nhập không hợp lệ!
                <br />
                Còn {attemptResult.remainingAttempts} lần thử
              </>,
            );
          } else {
            setError(
              `${data.message || "Đăng nhập thất bại!"}\nCòn ${attemptResult.remainingAttempts} lần thử`,
            );
          }
        }
      }
    } catch (err) {
      console.error("Network/Server error:", err);
      setError("Lỗi kết nối server! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (error) setError("");
  };

  const handleBackToHome = () => {
    if (onGuestMode) {
      onGuestMode();
    } else {
      window.location.hash = "home";
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };
  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      <div className="login-content">
        <button
          className="back-to-home-btn"
          onClick={handleBackToHome}
          disabled={loading}
          title="Trở về trang chủ"
        >
          <span className="btn-icon">
            <ArrowLeftCircle size={20} />
          </span>
          <span className="btn-text">Home</span>
        </button>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Header voi logo */}
          <div className="login-header">
            <div className="logo-container">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f"
                alt="Logo"
                className="login-logo"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "block";
                }}
              />
            </div>
            <h1 className="login-title">Đăng nhập</h1>
            <p className="login-subtitle">
              Đăng nhập trải ngiệm dịch vụ của chúng tôi
            </p>
          </div>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <div className="form-fields">
            <div className="form-group">
              <label className="form-label">Số điện thoại hoặc email</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  disabled={loading}
                  placeholder="Nhập số điện thoại hoặc email..."
                  className="form-input"
                />
                <div className="input-border"></div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  disabled={loading}
                  placeholder="Nhập mật khẩu..."
                  className="form-input"
                />
                <div className="input-border"></div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || lockoutInfo.locked}
            className={`submit-btn ${loading ? "loading" : ""} ${lockoutInfo.locked ? "disabled" : ""}`}
          >
            <span className="btn-content">
              {lockoutInfo.locked ? (
                <>
                  <span className="btn-icon">🔒</span>
                  <span className="btn-text">
                    Đăng nhập bị khóa. Vui lòng thử lại sau.
                  </span>
                </>
              ) : loading ? (
                <>
                  <span className="btn-text">Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span className="btn-text">Đăng nhập</span>
                </>
              )}
            </span>
            <div className="btn-ripple"></div>
          </button>

          <div className="login-footer">
            <p className="footer-text">
              Bạn chưa có tài khoản ?
              <button
                type="button"
                onClick={() => onSwitchToRegister && onSwitchToRegister()}
                className="register-link"
                disabled={loading}
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
