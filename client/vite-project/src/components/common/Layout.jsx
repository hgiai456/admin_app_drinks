import React from 'react';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';

export default function Layout({
    children,
    user,
    onLogout,
    currentPage = 'home',
    onCartCountChange
}) {
    return (
        <div className='homepage'>
            <Header
                user={user}
                onLogout={onLogout}
                currentPage={currentPage}
                onCartCountChange={onCartCountChange}
            />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
