import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#03091F]">
      <Sidebar />
      <div className="min-h-screen flex flex-col lg:pl-63">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#03091F]">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
