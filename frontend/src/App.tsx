import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import OrderForm from './pages/OrderForm';
import RefundForm from './pages/RefundForm';
import Tracking from './pages/Tracking';
import Login from './pages/Login';
import AdminLogin from './pages/admin/AdminLogin';
import MediatorLogin from './pages/mediator/MediatorLogin';
import SellerLogin from './pages/seller/SellerLogin';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyAccount from './pages/VerifyAccount';
import AdminLayout from './components/Layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminRefunds from './pages/admin/AdminRefunds';
import AdminMediators from './pages/admin/AdminMediators';
import AdminSellers from './pages/admin/AdminSellers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProfile from './pages/admin/AdminProfile';
import UserLayout from './components/Layout/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserOrders from './pages/user/UserOrders';
import UserRefunds from './pages/user/UserRefunds';
// import UserProfile from './pages/user/UserProfile.js';
import MediatorLayout from './components/Layout/MediatorLayout';
import MediatorDashboard from './pages/mediator/MediatorDashboard';
import MediatorOrders from './pages/mediator/MediatorOrders';
import MediatorProfile from './pages/mediator/MediatorProfile';
import Home from './pages/Home';
import MediatorRefund from './pages/mediator/MediatorRefund';
import UserActiveDeals from './pages/user/UserActiveDeals';
import UserProfile from './pages/user/UserProfile';
import SellerLayout from './components/Layout/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProfile from './pages/seller/SellerProfile';
import ActiveDeals from './pages/ActiveDeals';
import MediatorRegister from './pages/mediator/MediatorRegister';
import MediatorForgotPassword from './pages/mediator/MediatorForgotPassword';
import MediatorResetPassword from './pages/mediator/MediatorResetPassword';
import SellerRegister from './pages/seller/sellerRegister';
import SellerForgotPassword from './pages/seller/SellerForgotPassword';
import SellerResetPassword from './pages/seller/SellerResetPassword';
import SellerOrders from './pages/seller/SellerOrders';

// Protected Route Component
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated && user?.role === "admin" ? <>{children}</> : <Navigate to="/admin/login" replace />;
};
const ProtectedUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated && user?.role === "user" ? <>{children}</> : <Navigate to="/login" replace />;
};
const ProtectedMediatorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated && user?.role === "mediator" ? <>{children}</> : <Navigate to="/mediator/login" replace />;
};
const ProtectedSellerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated && user?.role === "seller" ? <>{children}</> : <Navigate to="/seller/login" replace />;
};

// Public Route Component (redirect to admin if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }



  if (isAuthenticated) {
    console.log(user?.role);
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === "user") {
      return <Navigate to="/user" replace />;
    } else if (user?.role === "mediator") {
      return <Navigate to="/mediator" replace />;
    } else if (user?.role === "seller") {
      return <Navigate to="/seller" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  } else {
    return <>{children}</>;
  } 
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home/>} />
            <Route path="/order" element={<OrderForm/>} />
            <Route path="/refund" element={<RefundForm/>} />
            <Route path="/track" element={<Tracking/>} />
            <Route path="/activedeals" element={<ActiveDeals/>} />


            {/* Admin Routes */}

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/admin/login"
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/mediator/login"
              element={
                <PublicRoute>
                  <MediatorLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/seller/login"
              element={
                <PublicRoute>
                  <SellerLogin />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path="/mediator/register"
              element={
                <PublicRoute>
                  <MediatorRegister />
                </PublicRoute>
              }
            />
            <Route
              path="/seller/register"
              element={
                <PublicRoute>
                  <SellerRegister />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/mediator/forgot-password"
              element={
                <PublicRoute>
                  <MediatorForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/seller/forgot-password"
              element={
                <PublicRoute>
                  <SellerForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/mediator/reset-password"
              element={
                <PublicRoute>
                  <MediatorResetPassword/>
                </PublicRoute>
              }
            />
            <Route
              path="/seller/reset-password"
              element={
                <PublicRoute>
                  <SellerResetPassword/>
                </PublicRoute>
              }
            />
            <Route
              path="/verify-account"
              element={
                <PublicRoute>
                  <VerifyAccount />
                </PublicRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              {/* This is the default page for /admin */}
              <Route index element={<AdminDashboard />} />
              {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
              <Route path="orders" element={<AdminOrders/>} />
              <Route path="refunds" element={<AdminRefunds />} />
              <Route path="mediators" element={<AdminMediators />} />
              <Route path="sellers" element={<AdminSellers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="profile" element={<AdminProfile/>} />
              {/* You can add more routes like 'settings' here */}
            </Route>


            <Route
              path="/user"
              element={
                <ProtectedUserRoute>
                  <UserLayout />
                </ProtectedUserRoute>
              }
            >
              {/* This is the default page for /admin */}
              <Route index element={<UserDashboard />} />
              {/* <Route path="/user/dashboard" element={<UserDashboard />} /> */}
              <Route path="/user/orders" element={<UserOrders/>} />
              <Route path="/user/refunds" element={<UserRefunds />} />
              <Route path="/user/profile" element={<UserProfile/>} />
              <Route path="/user/activedeals" element={<UserActiveDeals />} />
              {/* You can add more routes like 'settings' here */}
            </Route>

            <Route
              path="/seller"
              element={
                <ProtectedSellerRoute>
                  <SellerLayout />
                </ProtectedSellerRoute>
              }
            >
              {/* This is the default page for /seller */}
              <Route index element={<SellerDashboard />} />
              {/* <Route path="/seller/dashboard" element={<SellerDashboard />} /> */}
              <Route path="/seller/orders" element={<SellerOrders />} />
              <Route path="/seller/login" element={<SellerLogin/>} />
              <Route path="/seller/profile" element={<SellerProfile />} />
              {/* You can add more routes like 'settings' here */}
            </Route>
            <Route
              path="/mediator"
              element={
                <ProtectedMediatorRoute>
                  <MediatorLayout />
                </ProtectedMediatorRoute>
              }
            >
              {/* This is the default page for /admin */}
              <Route index element={<MediatorDashboard />} />
              {/* <Route path="/mediator/dashboard" element={<MediatorDashboard />} /> */}
              <Route path="/mediator/orders" element={<MediatorOrders/>} />
              <Route path="/mediator/refunds" element={<MediatorRefund />} />
              <Route path="/mediator/profile" element={<MediatorProfile />} />
              {/* You can add more routes like 'settings' here */}
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              // Define default options
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
                border: '1px solid #e5e7eb',
                boxShadow: '0 3px 10px rgb(0 0 0 / 0.1)',
              },

              // Define success options
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981', // Emerald 500
                  secondary: '#fff',
                },
              },

              // Define error options
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444', // Red 500
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;



