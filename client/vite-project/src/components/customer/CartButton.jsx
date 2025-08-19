// components/CartButton/CartButton.jsx
import React, { useState } from 'react';
import '@styles/pages/_cartbutton.scss';

const CartButton = ({
    cartItemCount = 0,
    currentPage = '',
    onCartClick,
    variant = 'default',
    onRefreshCount
}) => {
    const isActive = currentPage === 'cart';

    const handleCartClick = () => {
        if (onCartClick) {
            onCartClick();
        }

        // Refresh cart count nếu cần
        if (onRefreshCount) {
            onRefreshCount();
        }
    };

    return (
        <button
            className={`cart-btn cart-btn-${variant} ${
                isActive ? 'active' : ''
            }`}
            onClick={handleCartClick}
            title='Xem giỏ hàng'
        >
            <div className='cart-icon-wrapper'>
                {/* ✅ SVG ICON NHỎ GỌN HƠN */}
                <svg
                    className='cart-icon'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    {/* Cart outline - simplified */}
                    <path
                        d='M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    {/* Wheels - smaller */}
                    <circle cx='9' cy='20' r='1' fill='currentColor' />
                    <circle cx='20' cy='20' r='1' fill='currentColor' />

                    {/* ✅ BADGE Ở GÓC PHẢI TRÊN THAY VÌ GIỮA */}
                    {cartItemCount > 0 && (
                        <>
                            <circle
                                cx='18.5'
                                cy='6.5'
                                r='5.5'
                                fill='#dc2626'
                                className='cart-badge-bg'
                            />
                            <text
                                x='18.5'
                                y='9'
                                textAnchor='middle'
                                className='cart-badge-text'
                                fontSize={cartItemCount > 9 ? '4.5' : '5.5'}
                                fill='white'
                                fontWeight='700'
                            >
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </text>
                        </>
                    )}
                </svg>
            </div>
        </button>
    );
};

export default CartButton;
