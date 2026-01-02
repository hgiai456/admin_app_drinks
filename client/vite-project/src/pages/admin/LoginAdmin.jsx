import React, { useState } from 'react';
import '@styles/pages/_login.scss';

export default function LoginAdmin({
    onLogin,
    onSwitchToRegister,
    onGuestMode,
    successMessage,
    onClearMessage
}) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3003/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
            });
            const data = await res.json();
            if (res.ok) {
                if (
                    (res.ok && data.data?.user?.role === 2) ||
                    data.data?.user?.role === 1
                ) {
                    localStorage.setItem('admin_token', data.data.token);
                    onLogin(data.data.user);
                } else {
                    console.log('❌ Not admin role:', data.data?.user?.role);
                    setError('Sai tài khoản hoặc mật khẩu.');
                }
            } else {
                if (res.status === 401) {
                    setError('Sai tài khoản hoặc mật khẩu!');
                } else if (res.status === 404) {
                    setError('Tài khoản không tồn tại!');
                } else if (res.status === 400) {
                    setError('Thông tin đăng nhập không hợp lệ!');
                } else {
                    setError(data.message || 'Đăng nhập thất bại!');
                }
            }
        } catch (err) {
            console.error('❌ Network/Server error:', err);
            setError('Lỗi kết nối server! Vui lòng thử lại.');
        } finally {
            // ✅ LUÔN LUÔN TẮT LOADING STATE
            setLoading(false);
        }
    };
    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
        if (error) setError('');
    };

    const handleBackToHome = () => {
        if (onGuestMode) {
            onGuestMode();
        } else {
            window.location.hash = 'home';
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError('');
    };
    return (
        <div className='login-container'>
            <div className='login-background'>
                <div className='bg-shapes'>
                    <div className='shape shape-1'></div>
                    <div className='shape shape-2'></div>
                    <div className='shape shape-3'></div>
                    <div className='shape shape-4'></div>
                </div>
            </div>
            <div className='login-content'>
                <button
                    className='back-to-home-btn'
                    onClick={handleBackToHome}
                    disabled={loading}
                    title='Trở về trang chủ'
                >
                    <span className='btn-icon'>{'<<'}</span>
                    <span className='btn-text'> Trang chủ</span>
                </button>
                <form className='login-form' onSubmit={handleSubmit}>
                    {/* Header voi logo */}
                    <div className='login-header'>
                        <div className='logo-container'>
                            <img
                                src='https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f'
                                alt='Logo'
                                className='login-logo'
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display =
                                        'block';
                                }}
                            />
                        </div>
                        <h1 className='login-title'>Đăng nhập</h1>
                        <p className='login-subtitle'>
                            Đăng nhập trải ngiệm dịch vụ của chúng tôi
                        </p>
                    </div>
                    {error && (
                        <div className='error-message'>
                            <span className='error-icon'>⚠️</span>
                            <span className='error-text'>{error}</span>
                        </div>
                    )}

                    <div className='form-fields'>
                        <div className='form-group'>
                            <label className='form-label'>
                                Số điện thoại hoặc email
                            </label>
                            <div className='input-wrapper'>
                                <input
                                    type='text'
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    required
                                    disabled={loading}
                                    placeholder='Nhập số điện thoại hoặc email...'
                                    className='form-input'
                                />
                                <div className='input-border'></div>
                            </div>
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Mật khẩu</label>
                            <div className='input-wrapper'>
                                <input
                                    type='password'
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                    disabled={loading}
                                    placeholder='Nhập mật khẩu...'
                                    className='form-input'
                                />
                                <div className='input-border'></div>
                            </div>
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className={`submit-btn ${loading ? 'loading' : ''}`}
                    >
                        <span className='btn-content'>
                            {loading ? (
                                <>
                                    <span className='btn-spinner'>⏳</span>
                                    <span className='btn-text'>
                                        Đang đăng nhập...
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className='btn-icon'></span>
                                    <span className='btn-text'>Đăng nhập</span>
                                </>
                            )}
                        </span>
                        <div className='btn-ripple'></div>
                    </button>

                    <div className='login-footer'>
                        <p className='footer-text'>
                            Bạn chưa có tài khoản ?
                            <button
                                type='button'
                                onClick={() =>
                                    onSwitchToRegister && onSwitchToRegister()
                                }
                                className='register-link'
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
