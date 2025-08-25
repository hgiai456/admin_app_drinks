import React from 'react';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';

export default function Layout({
    children,
    user,
    onLogout,
    currentPage = 'home',
    onCartCountChange,
    isGuest = false,
    onLogin,
    onRegister
}) {
    return (
        <div className='homepage'>
            <Header
                user={user}
                onLogout={onLogout}
                currentPage={currentPage}
                onCartCountChange={onCartCountChange}
                isGuest={isGuest}
                onLogin={onLogin}
                onRegister={onRegister}
            />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
