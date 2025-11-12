

// @desc get User Dashboard (Using Aggregation)
// @route POST /api/user/dashboard

import Order from "../models/Order.js";
import Refund from "../models/Refund.js";

// @access Private(User)
export const getUserDashboard = async (req, res) => {
    try {
      const userEmail = req.user.email; 
      const { fromDate, toDate } = req.body;
  
      // Build date filter
      const dateFilter = { email: userEmail };
      if (fromDate && toDate) {
        dateFilter.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate)
        };
      } else if (fromDate) {
        dateFilter.createdAt = { $gte: new Date(fromDate) };
      } else if (toDate) {
        dateFilter.createdAt = { $lte: new Date(toDate) };
      }
  
      // Get orders with aggregation
      const ordersAggregate = await Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalOrderAmount: { $sum: '$orderAmount' },
            totalLessPrice: { $sum: '$lessPrice' },
            ordersByStatus: {
              $push: {
                status: '$orderStatus',
                amount: '$orderAmount',
                lessPrice: '$lessPrice',
                orderNumber: '$orderNumber',
                createdAt: '$createdAt'
              }
            }
          }
        }
      ]);
  
      // Get order IDs for refund lookup
      const userOrders = await Order.find(dateFilter).select('_id');
      const orderIds = userOrders.map(order => order._id);
  
      // Get refunds with aggregation
      const refundsAggregate = await Refund.aggregate([
        { 
          $match: { 
            order: { $in: orderIds },
            ...(fromDate || toDate ? {
              createdAt: {
                ...(fromDate && { $gte: new Date(fromDate) }),
                ...(toDate && { $lte: new Date(toDate) })
              }
            } : {})
          } 
        },
        {
          $lookup: {
            from: 'orders',
            localField: 'order',
            foreignField: '_id',
            as: 'orderInfo'
          }
        },
        {
          $unwind: '$orderInfo'
        },
        {
          $group: {
            _id: null,
            totalRefunds: { $sum: 1 },
            refundsByStatus: {
              $push: {
                status: '$status',
                orderAmount: '$orderInfo.orderAmount',
                lessPrice: '$orderInfo.lessPrice',
                orderNumber: '$orderInfo.orderNumber',
                createdAt: '$createdAt'
              }
            }
          }
        }
      ]);
  
      const ordersData = ordersAggregate[0] || {
        totalOrders: 0,
        totalOrderAmount: 0,
        totalLessPrice: 0,
        ordersByStatus: []
      };
  
      const refundsData = refundsAggregate[0] || {
        totalRefunds: 0,
        refundsByStatus: []
      };
  
      // Calculate orders by status
      const ordersByStatus = {
        accepted: 0,
        pending: 0,
        rejected: 0,
        payment_done: 0,
        refund_placed: 0
      };
  
      ordersData.ordersByStatus.forEach(order => {
        ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
      });
  
      // Calculate refunds by status
      const refundsByStatus = {
        accepted: 0,
        pending: 0,
        rejected: 0,
        payment_done: 0
      };
  
      refundsData.refundsByStatus.forEach(refund => {
        refundsByStatus[refund.status] = (refundsByStatus[refund.status] || 0) + 1;
      });
  
      // Calculate financial data
      const totalRefundAmount = ordersData.totalOrderAmount - ordersData.totalLessPrice;
  
      // Calculate pending and received refund amounts
      const pendingRefundAmount = refundsData.refundsByStatus
        .filter(refund => refund.status === 'pending' || refund.status === 'accepted')
        .reduce((sum, refund) => sum + (refund.orderAmount - refund.lessPrice), 0);
  
      const receivedRefundAmount = refundsData.refundsByStatus
        .filter(refund => refund.status === 'payment_done')
        .reduce((sum, refund) => sum + (refund.orderAmount - refund.lessPrice), 0);
  

      // Recent activities
      const recentOrders = ordersData.ordersByStatus
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        .map(order => ({
          orderNumber: order.orderNumber,
          amount: order.amount,
          status: order.status,
          date: order.createdAt,
          type: 'order'
        }));
  
      const recentRefunds = refundsData.refundsByStatus
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2)
        .map(refund => ({
          orderNumber: refund.orderNumber,
          amount: refund.orderAmount - refund.lessPrice,
          status: refund.status,
          date: refund.createdAt,
          type: 'refund'
        }));
  
      const recentActivities = [...recentOrders, ...recentRefunds]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
  
      const response = {
        summary: {
          totalOrders: ordersData.totalOrders,
          totalRefunds: refundsData.totalRefunds,
          totalOrderAmount: ordersData.totalOrderAmount,
          totalRefundAmount,
          netEarnings: receivedRefundAmount,
        },
        statusCounts: {
          orders: ordersByStatus,
          refunds: refundsByStatus
        },
        financial: {
          totalOrderAmount: ordersData.totalOrderAmount,
          totalLessPrice: ordersData.totalLessPrice,
          totalRefundAmount,
          pendingRefundAmount,
          receivedRefundAmount
        },
        recentActivities,
        dateRange: {
          fromDate: fromDate || 'Not specified',
          toDate: toDate || 'Not specified'
        }
      };
  
      res.status(200).json({
        success: true,
        data: response
      });
  
    } catch (error) {
      console.error('User Dashboard Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user dashboard data',
        error: error.message
      });
    }
  };