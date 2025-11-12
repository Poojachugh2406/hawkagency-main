// src/components/Layout/AdminLayout.tsx

import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom'; // Import Outlet and NavLink
import {
  Menu,
  X,
  Users,
  
  ShoppingCart,
  RefreshCw,
  LogOut,
  Home,
  UserCog,
  Box,
  UsersRound
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Navigation items configuration
const navigationItems = [
  // The `to` prop now points to the specific routes
  { id: 'dashboard', label: 'Dashboard', icon: Home, to: '/admin' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, to: '/admin/orders' },
  { id: 'refunds', label: 'Refunds', icon: RefreshCw, to: '/admin/refunds' },
  { id: 'products', label: 'Products', icon: Box, to: '/admin/products' },
  { id: 'mediators', label: 'Mediators', icon: UsersRound, to: '/admin/mediators' },
  { id: 'sellers', label: 'Sellers', icon: Users, to: '/admin/sellers' },
  { id: 'profile', label: 'Profile', icon: UserCog, to: '/admin/profile' },
];

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout,user } = useAuth();
  const navigate = useNavigate();
  const handleNavigationClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  }


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    {/* Use NavLink for automatic active styling */}
                    <NavLink
                      to={item.to}
                      end={item.to === '/admin'} // Ensures '/' doesn't stay active for other routes
                      onClick={handleNavigationClick}
                      className={({ isActive }) => `
                        flex items-center px-4 py-3 rounded-lg transition-colors
                        ${isActive
                          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
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
      </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
              >
                <Menu className="w-5 h-5" />
              </button>
              {/* The h1 and buttons will be rendered by child pages */}
              <div className="flex-1">
                {/* This space will be filled by the child page's header content */}
              </div>
            </div>
          </header>

          {/* Main Content Area - This is where child routes will render */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      );
};

      export default AdminLayout;


// 