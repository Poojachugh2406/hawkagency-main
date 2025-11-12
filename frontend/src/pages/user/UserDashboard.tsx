import { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api';
import { CreditCard, IndianRupee, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  summary: {
    totalOrders: number;
    totalRefunds: number;
    totalOrderAmount: number;
    totalRefundAmount: number;
    netEarnings: number;
    successRate?: {
      orders: number;
      refunds: number;
    };
  };
  statusCounts: {
    orders: {
      accepted: number;
      pending: number;
      rejected: number;
      payment_done: number;
      refund_placed: number;
    };
    refunds: {
      accepted: number;
      pending: number;
      rejected: number;
      payment_done: number;
    };
  };
  financial: {
    totalOrderAmount: number;
    totalLessPrice: number;
    totalRefundAmount: number;
    pendingRefundAmount: number;
    receivedRefundAmount: number;
    averageOrderValue?: number;
  };
  recentActivities: Array<{
    orderNumber: string;
    amount: number;
    status: string;
    date: string;
    type: 'order' | 'refund';
  }>;
  dateRange: {
    fromDate: string;
    toDate: string;
  };
}

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response:any = await apiGet("/user/dashboard");
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


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'payment_done':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'refund_placed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // const getStatusText = (status: string) => {
  //   return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  // };

  // const formatCurrency = (amount: number) => {
  //   return `₹${amount.toLocaleString()}`;
  // };

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

  const { summary, statusCounts, financial} = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your orders and refunds</p>
      </div>


  

      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* Refunds Earned */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg  transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Order Amount</p>
              <p className="text-3xl font-bold mt-2">₹{summary.totalOrderAmount}</p>
              <p className="text-purple-100 text-sm mt-2"> On all orders</p>
            </div>
            <div className="bg-purple-400 p-3 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </div>
        {/* Pending Refunds */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm font-medium">Refund Amount</p>
              <p className="text-3xl font-bold mt-2">₹{summary.totalRefundAmount}</p>
              <p className="text-purple-100 text-sm mt-2"> On all orders</p>
            </div>
            <div className="bg-orange-400 p-3 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>
                {/* Total Orders */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Pending Refunds</p>
              <p className="text-3xl font-bold mt-2">₹{financial.pendingRefundAmount}</p>
              <p className="text-blue-100 text-sm mt-2">Awaiting processing</p>
            </div>
            <div className="bg-blue-400 p-3 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium">Refund Earned</p>
              <p className="text-3xl font-bold mt-2">₹{financial.receivedRefundAmount}</p>
              <p className="text-green-100 text-sm mt-2">Successfully processed</p>
            </div>
            <div className="bg-green-400 p-3 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>
          </div>
      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
          <div className="space-y-3">
            {Object.entries(statusCounts.orders).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700 capitalize">
                  {status.split('_').join(' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
         
        {/* Refund Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Refund Status</h3>
          <div className="space-y-3">
            {Object.entries(statusCounts.refunds).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700 capitalize">
                  {status.split('_').join(' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>


         {/* Quick Stats */}
         <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div onClick={()=>navigate("/user/orders")}
             className="hover:cursor-pointer flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200 transition-transform duration-300 hover:-translate-y-2">
              <span className="text-blue-700 font-medium">Total Orders</span>
              <span className="text-blue-700 font-bold">{summary.totalOrders}</span>
            </div>
            <div onClick={()=>navigate("/user/refunds")} className="hover:cursor-pointer flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200 transition-transform duration-300 hover:-translate-y-2">
              <span className="text-green-700 font-medium">Total Refunds</span>
              <span className="text-green-700 font-bold">{summary.totalRefunds}</span>
            </div>
            {/* <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-purple-700 font-medium">Approved Refunds</span>
              <span className="text-purple-700 font-bold">{summary.totalRefunds}</span>
            </div> */}
            {/* <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"> */}
              {/* <span className="text-yellow-700 font-medium">Today's Refunds</span> */}
              {/* <span className="text-yellow-700 font-bold">₹{overview.todaysRefundAmount.toLocaleString()}</span> */}
             {/* </div> */}
          </div>
        </div>
      </div> 

     
    </div>
  );
}

export default UserDashboard;

