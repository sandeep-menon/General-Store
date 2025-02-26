import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStatusStore } from '@/store/status';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Store,
  LayoutDashboard,
  Users,
  ShoppingCart,
  ScanBarcode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './mode-toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Timer from './timer';

type LayoutProps = {
  children: React.ReactNode;
};

// Interface for sidebar items
interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Define sidebar items with their respective icons
  const sidebarItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Customers", path: "/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Orders", path: "/orders", icon: <ShoppingCart className="h-4 w-4" /> },
    { name: "Products", path: "/products", icon: <ScanBarcode className="h-4 w-4" /> },
  ];

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

  const status = useStatusStore((state) => state.status);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-4 font-semibold text-lg"><Store /><a href='/'>General Store</a></div>
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'w-64' : 'w-0 md:w-16'} 
            transition-all duration-300 ease-in-out
            border-r overflow-y-auto
            h-full md:sticky top-16 left-0 z-30
            bg-background md:bg-muted/40
          `}
        >
          <div className="flex flex-col h-full py-4">
            <div className={`flex ${sidebarOpen ? "justify-end" : "justify-center"} px-4 md:px-2`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="hidden md:flex"
                    >
                      {sidebarOpen ?
                        <ChevronLeft className="h-4 w-4" /> :
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Sidebar content */}
            <nav className="flex-1 px-2 mt-4">
              <ul className="space-y-2">
                <TooltipProvider>
                  {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                      <li key={item.name}>
                        {sidebarOpen ? (
                          // Full sidebar button with icon + text
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start gap-2 ${isActive ? "bg-primary text-white" : ""}`}
                            onClick={() => navigate(item.path)}
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </Button>
                        ) : (
                          // Collapsed sidebar button with just the icon
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={isActive ? "default" : "ghost"}
                                  className={`w-full flex justify-center ${isActive ? "bg-primary text-white" : ""}`}
                                  onClick={() => navigate(item.path)}
                                >
                                  {item.icon}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>{item.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </li>
                    );
                  })}
                </TooltipProvider>
              </ul>
            </nav>
          </div>
        </aside>

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
          <footer className="border-t px-4 py-1">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <div className='text-gray-500'>
                {status}
              </div>
              <div className='text-gray-500'>
                <Timer />
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;