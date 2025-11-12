import User from "../models/User.js";

import Order from "../models/Order.js";
import Refund from "../models/Refund.js";
// @desc    Get all products with seller details
// @route   GET /api/mediator/active-mediators
// @access  public
export const getActiveMediators = async (req, res) => {
    try {
      
      const mediators = await User.find({role:'mediator',isActive:true , isVerified:true}).sort({ createdAt: -1 });
      const allMediators = mediators.map(mediator=>({
        _id:mediator._id,
        nickName:mediator.nickName,
      }));
  
      res.status(200).json({
        success: true,
        message: 'mediators retrieved successfully',
        data: allMediators,
      });
  
    } catch (error) {
      console.error('Error fetching mediators:', error);
      
      res.status(500).json({
        success: false,
        message: 'Server error while fetching mediators'
      });
    }
  };
  
// @desc get Mediator Dashboard
// @route POST /api/mediator/dashboard
// @access Private(Mediator)
export const getMediatorDashboard = async (req, res) => {
  try {
    const mediatorId = req.user.id;
    const { fromDate, toDate } = req.body;

    // Build date filter
    const dateFilter = {};
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

    // Get mediator's orders
    const orders = await Order.find({ 
      mediator: mediatorId,
      ...dateFilter 
    });

    const totalOrders = orders.length;

    // Get order IDs for refund lookup
    const orderIds = orders.map(order => order._id);

    // Get refunds for mediator's orders
    const refunds = await Refund.find({ 
      order: { $in: orderIds },
      ...(fromDate || toDate ? {
        createdAt: {
          ...(fromDate && { $gte: new Date(fromDate) }),
          ...(toDate && { $lte: new Date(toDate) })
        }
      } : {})
    });

    const totalRefunds = refunds.length;

    // Calculate financial data
    const totalOrderAmount = orders.reduce((sum, order) => sum + order.orderAmount, 0);
    const totalLessPrice = orders.reduce((sum, order) => sum + order.lessPrice, 0);
    const totalRefundAmount = totalOrderAmount - totalLessPrice;

    // Orders by status
    const ordersByStatus = {
      accepted: orders.filter(order => order.orderStatus === 'accepted').length,
      pending: orders.filter(order => order.orderStatus === 'pending').length,
      rejected: orders.filter(order => order.orderStatus === 'rejected').length,
      payment_done: orders.filter(order => order.orderStatus === 'payment_done').length,
      refund_placed: orders.filter(order => order.orderStatus === 'refund_placed').length
    };

    // Refunds by status
    const refundsByStatus = {
      accepted: refunds.filter(refund => refund.status === 'accepted').length,
      pending: refunds.filter(refund => refund.status === 'pending').length,
      rejected: refunds.filter(refund => refund.status === 'rejected').length,
      payment_done: refunds.filter(refund => refund.status === 'payment_done').length
    };

    // Recent activities (last 5 orders)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        orderNumber: order.orderNumber,
        customerName: order.name,
        amount: order.orderAmount,
        status: order.orderStatus,
        date: order.createdAt,
        type: 'order'
      }));

    // Recent refunds (last 5)
    const recentRefunds = refunds
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(refund => ({
        orderNumber: refund.order.orderNumber,
        amount: refund.order.orderAmount - refund.order.lessPrice,
        status: refund.status,
        date: refund.createdAt,
        type: 'refund'
      }));

    const recentActivities = [...recentOrders, ...recentRefunds]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Performance metrics
    const successRate = totalOrders > 0 ? 
      ((ordersByStatus.accepted + ordersByStatus.payment_done) / totalOrders) * 100 : 0;

    const response = {
      summary: {
        totalOrders,
        totalRefunds,
        successRate: Math.round(successRate)
      },
      statusCounts: {
        orders: ordersByStatus,
        refunds: refundsByStatus
      },
      financial: {
        totalOrderAmount,
        totalLessPrice,
        totalRefundAmount,
        averageOrderValue: totalOrders > 0 ? totalOrderAmount / totalOrders : 0
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
    console.error('Mediator Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mediator dashboard data',
      error: error.message
    });
  }
};