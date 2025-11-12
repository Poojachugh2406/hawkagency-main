
import Order from "../models/Order.js";
import Refund from "../models/Refund.js";
import Product from "../models/Product.js";

// // @desc get Seller Dashboard (Using Aggregation)
// // @route Get /api/seller/dashboard
// // @access Private(Seller)
// export const getSellerDashboard = async (req, res) => {
//   try {
//     const sellerId = req.user.id; 
//     const { fromDate, toDate } = req.body;

//     // Build date filter
//     const dateFilter = {};
//     if (fromDate && toDate) {
//       dateFilter.createdAt = {
//         $gte: new Date(fromDate),
//         $lte: new Date(toDate)
//       };
//     } else if (fromDate) {
//       dateFilter.createdAt = { $gte: new Date(fromDate) };
//     } else if (toDate) {
//       dateFilter.createdAt = { $lte: new Date(toDate) };
//     }

//     // Get seller's products
//     const sellerProducts = await Product.find({ seller: sellerId });
//     const productIds = sellerProducts.map(product => product._id);

//     // Total counts and basic stats
//     const totalProducts = sellerProducts.length;
    
//     // Orders for seller's products
//     const ordersAggregate = await Order.aggregate([
//       {
//         $match: {
//           product: { $in: productIds },
//           ...dateFilter
//         }
//       },
//       {
//         $lookup: {
//           from: 'products',
//           localField: 'product',
//           foreignField: '_id',
//           as: 'productInfo'
//         }
//       },
//       {
//         $unwind: '$productInfo'
//       },
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           totalOrderAmount: { $sum: '$orderAmount' },
//           totalLessPrice: { $sum: '$lessPrice' },
//           ordersByStatus: {
//             $push: {
//               status: '$orderStatus',
//               amount: '$orderAmount',
//               productId: '$productInfo._id',
//               productName: '$productInfo.name',
//               createdAt: '$createdAt'
//             }
//           },
//           allOrders: { $push: '$$ROOT' }
//         }
//       }
//     ]);

//     // Get order IDs for refund lookup
//     const sellerOrders = await Order.find({ 
//       product: { $in: productIds },
//       ...dateFilter 
//     }).select('_id');
//     const orderIds = sellerOrders.map(order => order._id);

//     // Refunds for seller's orders
//     const refundsAggregate = await Refund.aggregate([
//       {
//         $match: {
//           order: { $in: orderIds },
//           ...(fromDate || toDate ? {
//             createdAt: {
//               ...(fromDate && { $gte: new Date(fromDate) }),
//               ...(toDate && { $lte: new Date(toDate) })
//             }
//           } : {})
//         }
//       },
//       {
//         $lookup: {
//           from: 'orders',
//           localField: 'order',
//           foreignField: '_id',
//           as: 'orderInfo'
//         }
//       },
//       {
//         $unwind: '$orderInfo'
//       },
//       {
//         $lookup: {
//           from: 'products',
//           localField: 'orderInfo.product',
//           foreignField: '_id',
//           as: 'productInfo'
//         }
//       },
//       {
//         $unwind: '$productInfo'
//       },
//       {
//         $group: {
//           _id: null,
//           totalRefunds: { $sum: 1 },
//           refundsByStatus: {
//             $push: {
//               status: '$status',
//               orderAmount: '$orderInfo.orderAmount',
//               lessPrice: '$orderInfo.lessPrice',
//               productId: '$productInfo._id',
//               productName: '$productInfo.name',
//               createdAt: '$createdAt'
//             }
//           }
//         }
//       }
//     ]);

//     // Product-wise performance
//     const productPerformance = await Order.aggregate([
//       {
//         $match: {
//           product: { $in: productIds },
//           ...dateFilter
//         }
//       },
//       {
//         $lookup: {
//           from: 'products',
//           localField: 'product',
//           foreignField: '_id',
//           as: 'productInfo'
//         }
//       },
//       {
//         $unwind: '$productInfo'
//       },
//       {
//         $group: {
//           _id: '$product',
//           productName: { $first: '$productInfo.name' },
//           productBrand: { $first: '$productInfo.brand' },
//           totalOrders: { $sum: 1 },
//           totalOrderAmount: { $sum: '$orderAmount' },
//           totalLessPrice: { $sum: '$lessPrice' },
//           ordersByStatus: {
//             $push: '$orderStatus'
//           },
//           dealTypeBreakdown: {
//             $push: '$dealType'
//           },
//           ratingTypeBreakdown: {
//             $push: '$ratingOrReview'
//           }
//         }
//       },
//       {
//         $project: {
//           productName: 1,
//           productBrand: 1,
//           totalOrders: 1,
//           totalOrderAmount: 1,
//           totalLessPrice: 1,
//           netRevenue: { $subtract: ['$totalOrderAmount', '$totalLessPrice'] },
//           acceptedOrders: {
//             $size: {
//               $filter: {
//                 input: '$ordersByStatus',
//                 as: 'status',
//                 cond: { $eq: ['$$status', 'accepted'] }
//               }
//             }
//           },
//           pendingOrders: {
//             $size: {
//               $filter: {
//                 input: '$ordersByStatus',
//                 as: 'status',
//                 cond: { $eq: ['$$status', 'pending'] }
//               }
//             }
//           },
//           rejectedOrders: {
//             $size: {
//               $filter: {
//                 input: '$ordersByStatus',
//                 as: 'status',
//                 cond: { $eq: ['$$status', 'rejected'] }
//               }
//             }
//           },
//           originalDeals: {
//             $size: {
//               $filter: {
//                 input: '$dealTypeBreakdown',
//                 as: 'deal',
//                 cond: { $eq: ['$$deal', 'original'] }
//               }
//             }
//           },
//           exchangeDeals: {
//             $size: {
//               $filter: {
//                 input: '$dealTypeBreakdown',
//                 as: 'deal',
//                 cond: { $eq: ['$$deal', 'exchange'] }
//               }
//             }
//           },
//           ratingOrders: {
//             $size: {
//               $filter: {
//                 input: '$ratingTypeBreakdown',
//                 as: 'type',
//                 cond: { $eq: ['$$type', 'rating'] }
//               }
//             }
//           },
//           reviewOrders: {
//             $size: {
//               $filter: {
//                 input: '$ratingTypeBreakdown',
//                 as: 'type',
//                 cond: { $eq: ['$$type', 'review'] }
//               }
//             }
//           },
//           onlyOrderOrders: {
//             $size: {
//               $filter: {
//                 input: '$ratingTypeBreakdown',
//                 as: 'type',
//                 cond: { $eq: ['$$type', 'only_order'] }
//               }
//             }
//           }
//         }
//       },
//       { $sort: { totalOrders: -1 } }
//     ]);

//     const ordersData = ordersAggregate[0] || {
//       totalOrders: 0,
//       totalOrderAmount: 0,
//       totalLessPrice: 0,
//       ordersByStatus: []
//     };

//     const refundsData = refundsAggregate[0] || {
//       totalRefunds: 0,
//       refundsByStatus: []
//     };

//     // Calculate orders by status
//     const ordersByStatus = {
//       accepted: 0,
//       pending: 0,
//       rejected: 0,
//       payment_done: 0,
//       refund_placed: 0
//     };

//     ordersData.ordersByStatus.forEach(order => {
//       ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
//     });

//     // Calculate refunds by status
//     const refundsByStatus = {
//       accepted: 0,
//       pending: 0,
//       rejected: 0,
//       payment_done: 0
//     };

//     refundsData.refundsByStatus.forEach(refund => {
//       refundsByStatus[refund.status] = (refundsByStatus[refund.status] || 0) + 1;
//     });

//     // Calculate financial metrics
//     const totalRefundAmount = ordersData.totalOrderAmount - ordersData.totalLessPrice;
//     const netRevenue = ordersData.totalOrderAmount - ordersData.totalLessPrice;

//     // Calculate success rates
//     const orderSuccessRate = ordersData.totalOrders > 0 ? 
//       (ordersByStatus.accepted / ordersData.totalOrders) * 100 : 0;

//     const refundSuccessRate = refundsData.totalRefunds > 0 ? 
//       (refundsByStatus.accepted / refundsData.totalRefunds) * 100 : 0;

//     // Top performing products (by orders)
//     const topProducts = productPerformance.slice(0, 5);

//     // Recent activities (last 5 orders)
//     const recentOrders = ordersData.ordersByStatus
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       .slice(0, 5)
//       .map(order => ({
//         productName: order.productName,
//         amount: order.amount,
//         status: order.status,
//         date: order.createdAt,
//         type: 'order'
//       }));

//     // Deal type breakdown
//     const dealTypeBreakdown = {
//       original: productPerformance.reduce((sum, product) => sum + product.originalDeals, 0),
//       exchange: productPerformance.reduce((sum, product) => sum + product.exchangeDeals, 0),
//       empty: ordersData.totalOrders - (productPerformance.reduce((sum, product) => sum + product.originalDeals, 0) + 
//              productPerformance.reduce((sum, product) => sum + product.exchangeDeals, 0))
//     };

//     // Rating type breakdown
//     const ratingTypeBreakdown = {
//       rating: productPerformance.reduce((sum, product) => sum + product.ratingOrders, 0),
//       review: productPerformance.reduce((sum, product) => sum + product.reviewOrders, 0),
//       only_order: productPerformance.reduce((sum, product) => sum + product.onlyOrderOrders, 0),
//       review_submitted: ordersData.totalOrders - (productPerformance.reduce((sum, product) => sum + product.ratingOrders, 0) + 
//                       productPerformance.reduce((sum, product) => sum + product.reviewOrders, 0) + 
//                       productPerformance.reduce((sum, product) => sum + product.onlyOrderOrders, 0))
//     };

//     const response = {
//       summary: {
//         totalProducts,
//         totalOrders: ordersData.totalOrders,
//         totalRefunds: refundsData.totalRefunds,
//         totalOrderAmount: ordersData.totalOrderAmount,
//         totalRefundAmount,
//         netRevenue,
//         successRate: {
//           orders: Math.round(orderSuccessRate),
//           refunds: Math.round(refundSuccessRate)
//         }
//       },
//       statusCounts: {
//         orders: ordersByStatus,
//         refunds: refundsByStatus
//       },
//       financial: {
//         totalOrderAmount: ordersData.totalOrderAmount,
//         totalLessPrice: ordersData.totalLessPrice,
//         totalRefundAmount,
//         netRevenue,
//         averageOrderValue: ordersData.totalOrders > 0 ? 
//           ordersData.totalOrderAmount / ordersData.totalOrders : 0,
//         conversionRate: totalProducts > 0 ? 
//           (ordersData.totalOrders / totalProducts) * 100 : 0
//       },
//       productPerformance,
//       topProducts,
//       breakdowns: {
//         dealType: dealTypeBreakdown,
//         ratingType: ratingTypeBreakdown
//       },
//       recentActivities: recentOrders,
//       dateRange: {
//         fromDate: fromDate || 'Not specified',
//         toDate: toDate || 'Not specified'
//       }
//     };

//     res.status(200).json({
//       success: true,
//       data: response
//     });

//   } catch (error) {
//     console.error('Seller Dashboard Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching seller dashboard data',
//       error: error.message
//     });
//   }
// };


// import Order from "../models/Order.js";
// import Refund from "../models/Refund.js";
// import Product from "../models/Product.js";

// @desc get Seller Dashboard
// @route POST /api/seller/dashboard
// @access Private(Seller)
export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;
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

    // Get seller's products
    const sellerProducts = await Product.find({ seller: sellerId });
    const productIds = sellerProducts.map(product => product._id);

    // Total counts
    const totalProducts = sellerProducts.length;

    // Get orders for seller's products
    const orders = await Order.find({ 
      product: { $in: productIds },
      ...dateFilter 
    });

    const totalOrders = orders.length;

    // Get order IDs for refund lookup
    const orderIds = orders.map(order => order._id);

    // Get refunds for seller's orders
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
    const netRevenue = totalRefundAmount;

    // Product performance
    const productPerformance = await Order.aggregate([
      {
        $match: {
          product: { $in: productIds },
          ...dateFilter
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $group: {
          _id: '$product',
          productName: { $first: '$productInfo.name' },
          productBrand: { $first: '$productInfo.brand' },
          totalOrders: { $sum: 1 },
          totalOrderAmount: { $sum: '$orderAmount' },
          totalLessPrice: { $sum: '$lessPrice' }
        }
      }
    ]);

    // Top products (sorted by total orders)
    const topProducts = productPerformance
      .map(product => ({
        ...product,
        netRevenue: product.totalOrderAmount - product.totalLessPrice
      }))
      .sort((a, b) => b.totalOrders - a.totalOrders);

    const response = {
      summary: {
        totalProducts,
        totalOrders,
        totalRefunds
      },
      financial: {
        totalOrderAmount,
        totalLessPrice,
        totalRefundAmount,
        netRevenue
      },
      productPerformance,
      topProducts,
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
    console.error('Seller Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seller dashboard data',
      error: error.message
    });
  }
};