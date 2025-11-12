import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Package, User, LogOut, Menu, X, RefreshCw, Home, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
// import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth provides a logout function

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, to: '/user' },
  { id: 'orders', label: 'My Orders', icon: Package, to: '/user/orders' },
  { id: 'refunds', label: 'My Refunds', icon: RefreshCw, to: '/user/refunds' },
  { id: 'activedeals', label: 'Active Deals', icon: ShoppingCart, to: '/user/activedeals' },
  { id: 'profile', label: 'Profile', icon: User, to: '/user/profile' },
];

const UserLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigationClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">My Account</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.to}
                    end={item.id === 'dashboard'}
                    onClick={handleNavigationClick}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 rounded-lg transition-colors
                      ${isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <div className="mb-4">
                {/* <p className="text-sm font-medium text-gray-900 truncate">{user?.    || 'User'}</p> */}
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 mr-2"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">User Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

