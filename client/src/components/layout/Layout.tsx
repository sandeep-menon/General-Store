import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from './header';
import AppSidebar from './sidebar';
import AppFooter from './footer';

type LayoutProps = {
  children: React.ReactNode;
};


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if the viewport is mobile on component mount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <AppHeader sidebarOpen={sidebarOpen} updateSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AppSidebar sidebarOpen={sidebarOpen} updateSidebarOpen={setSidebarOpen} navigate={navigate} />

        {/* Main content and Footer wrapper */}
        <div className="flex flex-col flex-1 overflow-auto">
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>

          {/* Footer */}
          <AppFooter />
        </div>
      </div>
    </div>
  );
};

export default Layout;