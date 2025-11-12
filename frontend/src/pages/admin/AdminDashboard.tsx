// import React from 'react';
// import {
//   RefreshCw,
//   AlertCircle,
//   BarChart3,
//   Users,
//   IndianRupee,
//   User2
// } from 'lucide-react';
// import { apiGet } from '../../utils/api';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { useQuery } from '@tanstack/react-query';

// interface DashboardData {
//   summary: {
//     totalOrders: number;
//     totalRefunds: number;
//     totalProducts: number;
//     totalMediators: number;
//     totalSellers: number;
//     totalUsers: number;
//   };
//   statusCounts: {
//     orders: {
//       accepted: number;
//       pending: number;
//       rejected: number;
//       payment_done: number;
//       refund_placed: number;
//     };
//     refunds: {
//       accepted: number;
//       pending: number;
//       rejected: number;
//       payment_done: number;
//     };
//   };
//   financial: {
//     totalOrderAmount: number;
//     totalLessPrice: number;
//     refundAmount: number;
//     averageOrderValue: number;
//   };
 
//   performance:{
//     topMediators: Array<{
//       mediatorId: string;
//       mediatorName: string;
//       orderCount: number;
//     }>;
//     topSellers: Array<{
//       sellerId: string;
//       sellerName: string;
//       orderCount: number;
//     }>;
//   }
  
//   dateRange: {
//     fromDate: string;
//     toDate: string;
//   };
// }

// const AdminDashboardPage: React.FC = () => {

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["dashboardStats"], // cache key
//     queryFn: () => apiGet('/admin/dashboard'),
//   });
//   const {user} = useAuth();
//   const navigate = useNavigate();


//   if (isLoading) return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//         <p className="text-gray-600">Loading dashboard...</p>
//       </div>
//     </div>);

//   if (isError) return <div>Something went wrong!</div>;
//     console.log(data);
//   const stats:DashboardData = data?.data as DashboardData ;
//   const getStatusColor = (status: string) => {
//     const colors: { [key: string]: string } = {
//       pending: 'bg-yellow-500',
//       accepted: 'bg-blue-500',
//       refund_placed: 'bg-purple-500',
//       payment_done: 'bg-green-500',
//       rejected: 'bg-red-500',
//     };
//     return colors[status] || 'bg-gray-500';
//   };

//   const getStatusLabel = (status: string) => {
//     const labels: { [key: string]: string } = {
//       order_placed: 'Order Placed',
//       refund_placed: 'Refund Placed',
//       reviewed: 'Reviewed',
//       payment_done: 'Payment Done',
//       rejected: 'Rejected',
//     };
//     return labels[status] || status;
//   };

//   if (!stats) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <p className="text-gray-600">Failed to load dashboard data</p>
//           <button
//             // onClick={fetchDashboardStats}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const {
//     summary,
//     statusCounts,
//     financial,
//     performance
//   } = stats;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Welcome {user?.name || 'Admin'} !</h1>
       
//           </div>
//           <div className="flex items-center space-x-4">
//           </div>
//         </div>
//       </div>

//       {/* Overview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Today's Orders */}
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-blue-100 text-sm font-medium">Total Users</p>
//               <p className="text-3xl font-bold mt-2">{summary.totalUsers}</p>
//               {/* <p className="text-blue-100 text-sm mt-2">New orders today</p> */}
//             </div>
//             <div className="bg-blue-400 p-3 rounded-xl">
//               <User2 className="w-6 h-6" />
//             </div>
//           </div>
//         </div>

//         {/* Total Revenue */}
//         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-green-100 text-sm font-medium">Total Orders Amount</p>
//               <p className="text-3xl font-bold mt-2">₹{financial.totalOrderAmount}</p>
//               <p className="text-green-100 text-sm mt-2">From all orders</p>
//             </div>
//             <div className="bg-green-400 p-3 rounded-xl">
//               <IndianRupee className="w-6 h-6" />
//             </div>
//           </div>
//         </div>

//         {/* Pending Refunds */}
//         <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-orange-100 text-sm font-medium">Total Refund Amount</p>
//               <p className="text-3xl font-bold mt-2">₹{financial.refundAmount}</p>
//               <p className="text-orange-100 text-sm mt-2">to pay</p>
//             </div>
//             <div className="bg-orange-400 p-3 rounded-xl">
//               <IndianRupee className="w-6 h-6" />
//             </div>
//           </div>
//         </div>

//         {/* Success Rate */}
//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-purple-100 text-sm font-medium">Total Sellers</p>
//               <p className="text-3xl font-bold mt-2">{summary.totalSellers}</p>
//             </div>
//             <div className="bg-purple-400 p-3 rounded-xl">
//               <Users className="w-6 h-6" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Order Status */}
//         <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
//             <BarChart3 className="w-5 h-5 text-gray-400" />
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {Object.entries(statusCounts.orders).map(([status, count]) => (
//               <div key={status} className="text-center p-4 bg-gray-50 rounded-xl">
//                 <div className={`w-3 h-3 ${getStatusColor(status)} rounded-full mx-auto mb-2`}></div>
//                 <p className="text-2xl font-bold text-gray-900">{count}</p>
//                 <p className="text-sm text-gray-600">{getStatusLabel(status)}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
//           <div className="space-y-4">
//             <div onClick={()=>navigate("/admin/orders")}
//              className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:cursor-pointer">
//               <span className="text-blue-700 font-medium">Total Orders</span>
//               <span className="text-blue-700 font-bold">{summary.totalOrders}</span>
//             </div>
        
//             <div  onClick={()=>navigate("/admin/refunds")}
//             className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:cursor-pointer">
//               <span className="text-green-700 font-medium">Total Refunds</span>
//               <span className="text-green-700 font-bold">{summary.totalRefunds}</span>
//             </div>
//             <div onClick={()=>navigate("/admin/products")}
//              className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg hover:cursor-pointer">
//               <span className="text-yellow-700 font-medium">Total Products</span>
//               <span className="text-yellow-700 font-bold">{summary.totalProducts}</span>
//             </div>
//             <div onClick={()=>navigate("/admin/mediators")}
//              className="flex justify-between items-center p-3 bg-orange-50 rounded-lg hover:cursor-pointer">
//               <span className="text-orange-700 font-medium">Total Mediators</span>
//               <span className="text-orange-700 font-bold">{summary.totalMediators}</span>
//             </div>
//             <div onClick={()=>navigate("/admin/sellers")}
//              className="flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:cursor-pointer">
//               <span className="text-purple-700 font-medium">Total Sellers</span>
//               <span className="text-purple-700 font-bold">{summary.totalSellers}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

//         {/* Top Mediators */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">Top Mediators</h2>
//           <div className="space-y-4">
//             {performance.topMediators.map((mediator, index) => (
//               <div key={mediator.mediatorId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                     {index + 1}
//                   </div>
//                   <div className="ml-3">
//                     <p className="font-medium text-gray-900">{mediator.mediatorName}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-gray-900">{mediator.orderCount} orders</p>
//                   {/* <p className="text-sm text-gray-500">Revenue</p> */}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>


//         <div className="bg-white rounded-2xl p-6 shadow-lg">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">Top Sellers</h2>
//           <div className="space-y-4">
//             {performance.topSellers.map((seller, index) => (
//               <div key={seller.sellerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                     {index + 1}
//                   </div>
//                   <div className="ml-3">
//                     <p className="font-medium text-gray-900">{seller.sellerName}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-gray-900">{seller.orderCount} orders</p>
//                   {/* <p className="text-sm text-gray-500">Revenue</p> */}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardPage;



import React, { useState } from 'react';
import {
  RefreshCw,
  AlertCircle,
  BarChart3,
  IndianRupee,
  User2,
  Filter,
  X,
  CheckCircle
} from 'lucide-react';
import { apiGet } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';

interface DashboardData {
  summary: {
    totalOrders: number;
    totalRefunds: number;
    totalProducts: number;
    totalMediators: number;
    totalSellers: number;
    totalUsers: number;
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
    refundAmount: number;
    averageOrderValue: number;
    totalPaidRefundAmount:number;
  };
 
  performance:{
    topMediators: Array<{
      mediatorId: string;
      mediatorName: string;
      orderCount: number;
    }>;
    topSellers: Array<{
      sellerId: string;
      sellerName: string;
      orderCount: number;
    }>;
  }
  
  dateRange: {
    fromDate: string;
    toDate: string;
  };
}

const AdminDashboardPage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState({
    fromDate: '',
    toDate: ''
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [queryParams, setQueryParams] = useState({
    fromDate: '',
    toDate: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  // Use queryParams in the query key instead of dateFilter
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboardStats", queryParams.fromDate, queryParams.toDate],
    queryFn: () => apiGet(`/admin/dashboard`, {
      fromDate: queryParams.fromDate, 
      toDate: queryParams.toDate
    }),
  });

  const handleApplyFilter = () => {
    if (dateFilter.fromDate && dateFilter.toDate) {
      setIsFilterApplied(true);
      // Only update queryParams when Apply is clicked
      setQueryParams({
        fromDate: dateFilter.fromDate,
        toDate: dateFilter.toDate
      });
    }
  };

  const handleClearFilter = () => {
    setDateFilter({
      fromDate: '',
      toDate: ''
    });
    setQueryParams({
      fromDate: '',
      toDate: ''
    });
    setIsFilterApplied(false);
  };

  const handleDateChange = (field: 'fromDate' | 'toDate', value: string) => {
    setDateFilter(prev => ({
      ...prev,
      [field]: value
    }));
    // Remove the setIsFilterApplied(false) from here to prevent unwanted behavior
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Failed to load dashboard data</p>
        <Button onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    </div>
  );

  console.log(data);
  const stats: DashboardData = data?.data as DashboardData;

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-500',
      accepted: 'bg-blue-500',
      refund_placed: 'bg-purple-500',
      payment_done: 'bg-green-500',
      rejected: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      order_placed: 'Order Placed',
      refund_placed: 'Refund Placed',
      reviewed: 'Reviewed',
      payment_done: 'Payment Done',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const {
    summary,
    statusCounts,
    financial,
    performance
  } = stats;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome {user?.name || 'Admin'} !</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Date Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Date Range:</span>
                </div>
                <Input
                  type="date"
                  label='From'
                  value={dateFilter.fromDate}
                  onChange={(e) => handleDateChange('fromDate', e.target.value)}
                  className="w-40"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  label ="TO"
                  value={dateFilter.toDate}
                  onChange={(e) => handleDateChange('toDate', e.target.value)}
                  className="w-40"
                />
                <Button
                  onClick={handleApplyFilter}
                  disabled={!dateFilter.fromDate || !dateFilter.toDate}
                  size="sm"
                >
                  Apply
                </Button>
                {isFilterApplied && (
                  <Button
                    onClick={handleClearFilter}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </Button>
                )}
              </div>
              {isFilterApplied && (
                <div className="mt-2 text-xs text-gray-500">
                  Showing data from {dateFilter.fromDate} to {dateFilter.toDate}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-2">{summary.totalUsers}</p>
            </div>
            <div className="bg-blue-400 p-3 rounded-xl">
              <User2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Orders Amount</p>
              <p className="text-3xl font-bold mt-2">₹{financial.totalOrderAmount}</p>
              <p className="text-green-100 text-sm mt-2">From all orders</p>
            </div>
            <div className="bg-green-400 p-3 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Pending Refunds */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Refund Amount</p>
              <p className="text-3xl font-bold mt-2">₹{financial.refundAmount - financial.totalPaidRefundAmount}</p>
              <p className="text-orange-100 text-sm mt-2">to pay</p>
            </div>
            <div className="bg-orange-400 p-3 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium">Paid Refund</p>
              <p className="text-3xl font-bold mt-2">₹{financial.totalPaidRefundAmount}</p>
            </div>
            <div className="bg-purple-400 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(statusCounts.orders).map(([status, count]) => (
              <div key={status} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className={`w-3 h-3 ${getStatusColor(status)} rounded-full mx-auto mb-2`}></div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">{getStatusLabel(status)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div onClick={() => navigate("/admin/orders")}
              className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:cursor-pointer hover:bg-blue-100 transition-colors">
              <span className="text-blue-700 font-medium">Total Orders</span>
              <span className="text-blue-700 font-bold">{summary.totalOrders}</span>
            </div>

            <div onClick={() => navigate("/admin/refunds")}
              className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:cursor-pointer hover:bg-green-100 transition-colors">
              <span className="text-green-700 font-medium">Total Refunds</span>
              <span className="text-green-700 font-bold">{summary.totalRefunds}</span>
            </div>
            <div onClick={() => navigate("/admin/products")}
              className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg hover:cursor-pointer hover:bg-yellow-100 transition-colors">
              <span className="text-yellow-700 font-medium">Total Products</span>
              <span className="text-yellow-700 font-bold">{summary.totalProducts}</span>
            </div>
            <div onClick={() => navigate("/admin/mediators")}
              className="flex justify-between items-center p-3 bg-orange-50 rounded-lg hover:cursor-pointer hover:bg-orange-100 transition-colors">
              <span className="text-orange-700 font-medium">Total Mediators</span>
              <span className="text-orange-700 font-bold">{summary.totalMediators}</span>
            </div>
            <div onClick={() => navigate("/admin/sellers")}
              className="flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:cursor-pointer hover:bg-purple-100 transition-colors">
              <span className="text-purple-700 font-medium">Total Sellers</span>
              <span className="text-purple-700 font-bold">{summary.totalSellers}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Mediators */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Mediators</h2>
            <span className="text-sm text-gray-500">
              {performance.topMediators.length} mediators
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {performance.topMediators.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No mediator data available
              </div>
            ) : (
              performance.topMediators.map((mediator, index) => (
                <div key={mediator.mediatorId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate" title={mediator.mediatorName}>
                        {mediator.mediatorName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-gray-900">{mediator.orderCount} orders</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Sellers</h2>
            <span className="text-sm text-gray-500">
              {performance.topSellers.length} sellers
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {performance.topSellers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No seller data available
              </div>
            ) : (
              performance.topSellers.map((seller, index) => (
                <div key={seller.sellerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate" title={seller.sellerName}>
                        {seller.sellerName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-gray-900">{seller.orderCount} orders</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;