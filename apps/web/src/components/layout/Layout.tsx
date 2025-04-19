import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

/**
 * 전체 레이아웃 컴포넌트
 * 헤더와 푸터를 포함한 페이지 구조를 제공합니다.
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout; 