import  { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api';
import {IndianRupee, TrendingUp,  ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  summary: {
    totalProducts: number;
    totalOrders: number;
    totalRefunds: number;
  };
  financial: {
    totalOrderAmount: number;
    totalLessPrice: number;
    totalRefundAmount: number;
    netRevenue: number;
  };
  productPerformance: Array<{
    _id: string;
    productName: string;
    productBrand: string;
    totalOrders: number;
    totalOrderAmount: number;
    totalLessPrice: number;
  }>;
  topProducts: Array<{
    _id: string;
    productName: string;
    productBrand: string;
    totalOrders: number;
    totalOrderAmount: number;
    totalLessPrice: number;
    netRevenue: number;
  }>;
  dateRange: {
    fromDate: string;
    toDate: string;
  };
}

function SellerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await apiGet("/seller/dashboard");
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">No data available</div>
      </div>
    );
  }

  const { summary, financial, topProducts} = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        {/* <p className="text-gray-600 mt-2">Manage your products and track performance</p> */}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Order Amount</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(financial.totalOrderAmount)}</p>
              <p className="text-purple-100 text-sm mt-2">all orders</p>
            </div>
            <div className="bg-purple-400 p-3 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Refund Amount</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(financial.totalRefundAmount)}</p>
              <p className="text-blue-100 text-sm mt-2">all orders</p>
            </div>
            <div className="bg-blue-400 p-3 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold mt-2">{summary.totalProducts}</p>
              <p className="text-green-100 text-sm mt-2">all products</p>
            </div>
            <div className="bg-green-400 p-3 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Refunds */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold mt-2">{summary.totalOrders}</p>
              <p className="text-orange-100 text-sm mt-2">all orders</p>
            </div>
            <div className="bg-orange-400 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div 
              className="hover:cursor-pointer flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="text-blue-700 font-medium">Total Products</span>
              <span className="text-blue-700 font-bold">{summary.totalProducts}</span>
            </div>
            <div 
              onClick={() => navigate("/seller/orders")}
              className="hover:cursor-pointer flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="text-green-700 font-medium">Total Orders</span>
              <span className="text-green-700 font-bold">{summary.totalOrders}</span>
            </div>
            <div 
              onClick={() => navigate("/seller/orders")}
              className="hover:cursor-pointer flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="text-purple-700 font-medium">Total Refunds</span>
              <span className="text-purple-700 font-bold">{summary.totalRefunds}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Top Performing Products</h3>
            <div className="text-green-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-4">
            {topProducts.slice(0, 5).map((product, index) => (
              <div 
                key={product._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.productName}</p>
                    <p className="text-sm text-gray-500">{product.productBrand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.totalOrders} orders</p>
                  <p className="text-sm text-green-600 font-medium">
                    {formatCurrency(product.totalOrderAmount)}
                  </p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products data available
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default SellerDashboard;