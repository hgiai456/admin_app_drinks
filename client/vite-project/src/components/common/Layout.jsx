import React from 'react';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';

export default function Layout({
    children,
    user,
    onLogout,
    currentPage = 'home'
}) {
    return (
        <div className='homepage'>
            <Header user={user} onLogout={onLogout} currentPage={currentPage} />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
