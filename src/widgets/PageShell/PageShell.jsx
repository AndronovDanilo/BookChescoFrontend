import React from 'react';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';

function PageShell({ children, onOpenAuth }) {
    return (
        <>
            <Header onOpenAuth={onOpenAuth} />

            <main>
                {children}
            </main>

            <Footer />
        </>
    );
}

export default PageShell;