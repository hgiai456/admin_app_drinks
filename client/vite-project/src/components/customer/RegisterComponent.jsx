import React, { useState } from 'react';
import UserAPI from '@api/userapi';
import User from '@models/user';
import '@styles/pages/_register.scss';

export default function RegisterComponent({ onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Họ tên không được để trống';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại không được để trống';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Địa chỉ không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));

        //Xóa thông báo lỗi khi mà người dùng nhập
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: ''
            }));
        }

        if (message) setMessage('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage('❌ Vui lòng kiểm tra lại thông tin');
            return;
        }
        setLoading(true);
        setMessage('');

        try {
            console.log('🔄 Đang đăng ký tài khoản với dữ liệu:', formData);

            const userData = {
                email: formData.email.trim(),
                password: formData.password,
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim()
            };

            const newUser = await UserAPI.create(userData);

            console.log('✅ Đăng ký thành công:', newUser);

            setMessage('✅ Đăng ký tài khoản thành công!');
            setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                phone: '',
                address: ''
            }); //Reset form clear data
            setErrors({});

            if (onRegisterSuccess) {
                setTimeout(() => {
                    onRegisterSuccess(newUser);
                }, 1500);
            }
        } catch (error) {
            console.error('❌ Lỗi đăng ký:', error);

            let errorMessage = 'Đăng ký thất bại! Vui lòng thử lại.';

            if (error.message.includes('400')) {
                errorMessage = 'Thông tin không hợp lệ';
            } else if (error.message.includes('409')) {
                errorMessage = 'Email hoặc số điện thoại đã được sử dụng';
            } else if (error.message.includes('500')) {
                errorMessage = 'Lỗi server! Vui lòng thử lại sau';
            }
            setMessage(`❌ ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='register-container'>
            <div className='register-background'>
                <div className='bg-shapes'>
                    <div className='shape shape-1'></div>
                    <div className='shape shape-2'></div>
                    <div className='shape shape-3'></div>
                    <div className='shape shape-4'></div>
                </div>
            </div>

            <div className='register-content'>
                <form className='register-form' onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className='register-header'>
                        <div className='logo-container'>
                            <img
                                src='https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f'
                                alt='Logo'
                                className='register-logo'
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                        <h1 className='register-title'>Đăng ký tài khoản</h1>
                        <p className='register-subtitle'>
                            Tạo tài khoản để trải nghiệm dịch vụ của chúng tôi
                        </p>
                    </div>

                    {/* Message */}
                    {message && (
                        <div
                            className={`register-message ${
                                message.includes('✅')
                                    ? 'success-message'
                                    : 'error-message'
                            }`}
                        >
                            <span className='message-icon'>
                                {message.includes('✅') ? '✅' : '⚠️'}
                            </span>
                            <span className='message-text'>{message}</span>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className='form-fields'>
                        {/* Email */}
                        <div className='form-group'>
                            <label className='form-label'>
                                Email <span className='required'>*</span>
                            </label>
                            <div className='input-wrapper'>
                                <input
                                    type='email'
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'email',
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                    placeholder='Nhập địa chỉ email...'
                                    className={`form-input ${
                                        errors.email ? 'error' : ''
                                    }`}
                                />
                                <div className='input-border'></div>
                            </div>
                            {errors.email && (
                                <span className='field-error'>
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        {/* Name */}
                        <div className='form-group'>
                            <label className='form-label'>
                                Họ và tên <span className='required'>*</span>
                            </label>
                            <div className='input-wrapper'>
                                <input
                                    type='text'
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                    placeholder='Nhập họ và tên...'
                                    className={`form-input ${
                                        errors.name ? 'error' : ''
                                    }`}
                                />
                                <div className='input-border'></div>
                            </div>
                            {errors.name && (
                                <span className='field-error'>
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        {/* Phone */}
                        <div className='form-group'>
                            <label className='form-label'>
                                Số điện thoại{' '}
                                <span className='required'>*</span>
                            </label>
                            <div className='input-wrapper'>
                                <input
                                    type='tel'
                                    value={formData.phone}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'phone',
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                    placeholder='Nhập số điện thoại...'
                                    className={`form-input ${
                                        errors.phone ? 'error' : ''
                                    }`}
                                />
                                <div className='input-border'></div>
                            </div>
                            {errors.phone && (
                                <span className='field-error'>
                                    {errors.phone}
                                </span>
                            )}
                        </div>

                        {/* Address */}
                        <div className='form-group'>
                            <label className='form-label'>
                                Địa chỉ <span className='required'>*</span>
                            </label>
                            <div className='input-wrapper'>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'address',
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                    placeholder='Nhập địa chỉ...'
                                    className={`form-input form-textarea ${
                                        errors.address ? 'error' : ''
                                    }`}
                                    rows={3}
                                />
                                <div className='input-border'></div>
                            </div>
                            {errors.address && (
                                <span className='field-error'>
                                    {errors.address}
                                </span>
                            )}
                        </div>

                        {/* Password */}
                        <div className='form-group'>
                            <label className='form-label'>
                                Mật khẩu <span className='required'>*</span>
                            </label>
                            <div className='input-wrapper'>
                                <input
                                    type='password'
                                    value={formData.password}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'password',
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                    placeholder='Nhập mật khẩu (ít nhất 6 ký tự)...'
                                    className={`form-input ${
                                        errors.password ? 'error' : ''
                                    }`}
                                />
                                <div className='input-border'></div>
                            </div>
                            {errors.password && (
                                <span className='field-error'>
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className='form-group'>
                            <label className='form-label'>
                                Xác nhận mật khẩu{' '}
                                <span className='required'>*</span>
                            </label>
                            <div className='input-wrapper'>
                                <input
                                    type='password'
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'confirmPassword',
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                    placeholder='Nhập lại mật khẩu...'
                                    className={`form-input ${
                                        errors.confirmPassword ? 'error' : ''
                                    }`}
                                />
                                <div className='input-border'></div>
                            </div>
                            {errors.confirmPassword && (
                                <span className='field-error'>
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='register-submit-btn'
                    >
                        <span className='btn-content'>
                            {loading ? (
                                <>
                                    <span className='btn-spinner'>⏳</span>
                                    <span className='btn-text'>
                                        Đang đăng ký...
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className='btn-text'>
                                        Đăng ký tài khoản
                                    </span>
                                </>
                            )}
                        </span>
                        <div className='btn-ripple'></div>
                    </button>

                    {/* Back to Login Link */}
                    <div className='register-footer'>
                        <p className='footer-text'>
                            Đã có tài khoản?
                            <button
                                type='button'
                                onClick={() =>
                                    onRegisterSuccess && onRegisterSuccess(null)
                                }
                                className='login-link'
                                disabled={loading}
                            >
                                Đăng nhập ngay
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
