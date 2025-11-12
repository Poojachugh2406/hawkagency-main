
import mongoose from 'mongoose';
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from '../models/Order.js';
import Refund from '../models/Refund.js';


// @desc    Create new mediator user
// @route   POST /api/admin/new-user
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, nickName } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !phone || !password ) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone and password are required fields.'
      });
    }

    // Check if user already exists with the same email
    const existingUser = await User.findOne(
      
        { email: email.toLowerCase() }
     
    );

    if (existingUser && existingUser.role !== 'user') {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email or phone number.'
      });
    }

    let savedUser;

    if (!existingUser) {
      // Create new user with mediator role
      const newUser = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: password,
        isVerified: true,
        nickName: nickName.trim(),
        role: role || 'mediator', // Default to mediator if role not provided
      });

      // Save user to database
      savedUser = await newUser.save();
    }else{
      existingUser.name = name;
      existingUser.nickName = nickName;
      existingUser.phone = phone;
      existingUser.role = role||'mediator';
      savedUser = await existingUser.save();
    }

    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      phone: savedUser.phone,
      role: savedUser.role,
      isActive: savedUser.isActive,
      createdAt: savedUser.createdAt,
      nickName: savedUser.nickName,
    };
    res.status(201).json({
      success: true,
      message: 'user created successfully',
      data: userResponse
    });


  } catch (error) {
    console.error('Error creating mediator user:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating mediator user'
    });
  }
};


// @desc    Get all mediator accounts (simple version)
// @route   GET /api/admin/all-mediators
// @access  Private/Admin
export const getAllMediators = async (req, res) => {
  try {
    const mediators = await User.find({ role: 'mediator' })
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }); // Sort by latest first

    // Format response data
    const mediatorsData = mediators.map(mediator => ({
      _id: mediator._id,
      name: mediator.name,
      nickName: mediator.nickName,
      email: mediator.email,
      phone: mediator.phone,
      role: mediator.role,
      isActive: mediator.isActive,
      isVerified: mediator.isVerified,
      upiId: mediator.upiId,
      accountNumber: mediator.accountNumber,
      accountIfsc: mediator.accountIfsc,
      lastLogin: mediator.lastLogin,
      createdAt: mediator.createdAt,
      updatedAt: mediator.updatedAt
    }));

    res.status(200).json({
      success: true,
      message: 'Mediators retrieved successfully',
      data: mediatorsData,
      count: mediators.length
    });

  } catch (error) {
    console.error('Error fetching mediators:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching mediators'
    });
  }
};

// @desc    Get all seller accounts
// @route   GET /api/admin/all-sellers
// @access  Private/Admin
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' })
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }); // Sort by latest first

    // Format response data
    const sellersData = sellers.map(seller => ({
      _id: seller._id,
      name: seller.name,
      nickName: seller.nickName,
      email: seller.email,
      phone: seller.phone,
      role: seller.role,
      isActive: seller.isActive,
      isVerified: seller.isVerified,
      upiId: seller.upiId,
      accountNumber: seller.accountNumber,
      accountIfsc: seller.accountIfsc,
      lastLogin: seller.lastLogin,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt
    }));

    res.status(200).json({
      success: true,
      message: 'Sellers retrieved successfully',
      data: sellersData,
      count: sellers.length
    });

  } catch (error) {
    console.error('Error fetching sellers:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching sellers'
    });
  }
};


// @desc    Update user profile
// @route   PUT /api/admin/update-profile
// @access  Private
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    // Prevent updating email and role through this endpoint
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Update admin profile error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};


// @desc    Toggle mediator active status
// @route   PATCH /api/admin/mediators/:id/toggle-status
// @access  Private/Admin
export const toggleMediatorStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mediator ID format.'
      });
    }

    const mediator = await User.findOne({ _id: id, role: 'mediator' });

    if (!mediator) {
      return res.status(404).json({
        success: false,
        message: 'Mediator not found'
      });
    }

    mediator.isActive = !mediator.isActive;
    const updatedMediator = await mediator.save();

    // Format response without password
    const mediatorResponse = {
      _id: updatedMediator._id,
      name: updatedMediator.name,
      email: updatedMediator.email,
      phone: updatedMediator.phone,
      role: updatedMediator.role,
      isActive: updatedMediator.isActive,
      isVerified: updatedMediator.isVerified,
      upiId: updatedMediator.upiId,
      accountNumber: updatedMediator.accountNumber,
      accountIfsc: updatedMediator.accountIfsc,
      lastLogin: updatedMediator.lastLogin,
      createdAt: updatedMediator.createdAt,
      updatedAt: updatedMediator.updatedAt
    };

    res.status(200).json({
      success: true,
      message: `Mediator ${updatedMediator.isActive ? 'activated' : 'deactivated'} successfully`,
      data: mediatorResponse
    });

  } catch (error) {
    console.error('Error toggling mediator status:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid mediator ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating mediator status'
    });
  }
};

// @desc    Toggle seller active status
// @route   PATCH /api/admin/sellers/:id/toggle-status
// @access  Private/Admin
export const toggleSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seller ID format.'
      });
    }

    const seller = await User.findOne({ _id: id, role: 'seller' });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    seller.isActive = !seller.isActive;
    const updatedSeller = await seller.save();

    // Format response without password
    const sellerResponse = {
      _id: updatedSeller._id,
      name: updatedSeller.name,
      email: updatedSeller.email,
      phone: updatedSeller.phone,
      role: updatedSeller.role,
      isActive: updatedSeller.isActive,
      isVerified: updatedSeller.isVerified,
      upiId: updatedSeller.upiId,
      accountNumber: updatedSeller.accountNumber,
      accountIfsc: updatedSeller.accountIfsc,
      lastLogin: updatedSeller.lastLogin,
      createdAt: updatedSeller.createdAt,
      updatedAt: updatedSeller.updatedAt
    };

    res.status(200).json({
      success: true,
      message: `Seller ${updatedSeller.isActive ? 'activated' : 'deactivated'} successfully`,
      data: sellerResponse
    });

  } catch (error) {
    console.error('Error toggling seller status:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid seller ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating seller status'
    });
  }
};


// @desc   Delete User
// @route   PATCH /api/admin/delete-user/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format.'
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {
        _id: deletedUser._id,
        name: deletedUser.name
      }
    });

  } catch (error) {
    console.error('Error deleting user:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};


// @desc    Update user profile
// @route   PUT /api/admin/update-profile/:id
// @access  Private(admin)
export const updateUserProfile = async (req, res) => {
  try {
    const updateData = req.body;
    const userId = req.params.id;

    // Prevent updating email and role through this endpoint
    if (updateData.email || updateData.role) {
      return res.status(400).json({
        success: false,
        message: 'Email and role cannot be updated'
      });
    }
    if (updateData._id) delete (updateData._id);
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          nickName: user.nickName ?? "N/A",
          phone: user.phone,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        }
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};



// @desc verify user 
// @route POST /api/admin/verify-user
// @access Private(Admin)
export const verifyUserAdmin = async (req, res) => {
  try {

    const id = req.body.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mediator ID format.'
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified"
      })
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User verified SuccessFully"
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });

  }
}


// @desc reject user 
// @route POST /api/admin/reject-user
// @access Private(Admin)
export const rejectUserAdmin = async (req, res) => {
  try {
    const id = req.body.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mediator ID format.'
      });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "User rejected SuccessFully"
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
}



// // @desc get Admin Dashboard
// // @route POST /api/admin/dashboard
// // @access Private(Admin)
// export const getAdminDashboard = async (req, res) => {
//   try {
//     const { fromDate, toDate } = req.query;

//     // Build date filter
//     const dateFilter = {};
//     if (fromDate && toDate) {
//       const endDate = new Date(toDate);
//       endDate.setHours(23,59,59,999);
//       dateFilter.createdAt = {
//         $gte: new Date(fromDate),
//         $lte: new Date(endDate)
//       };
//     } else if (fromDate) {
//       dateFilter.createdAt = { $gte: new Date(fromDate) };
//     } else if (toDate) {
//       dateFilter.createdAt = { $lte: new Date(toDate) };
//     }

//     // Run all queries concurrently for better performance
//     const [
//       totalOrders,
//       totalRefunds,
//       totalProducts,
//       totalMediators,
//       totalSellers,
//       totalUsers,
//       ordersByStatus,
//       refundsByStatus,
//       financialStats,
//       ordersByMediator,
//       ordersBySeller
//     ] = await Promise.all([
//       // Basic counts
//       Order.countDocuments(dateFilter),
//       Refund.countDocuments(dateFilter),
//       Product.countDocuments(dateFilter),
//       User.countDocuments({ ...dateFilter, role: 'mediator' }),
//       User.countDocuments({ ...dateFilter, role: 'seller' }),
//       User.countDocuments({ ...dateFilter, role: 'user' }),

//       // Orders by status
//       Order.aggregate([
//         { $match: dateFilter },
//         {
//           $group: {
//             _id: '$orderStatus',
//             count: { $sum: 1 }
//           }
//         }
//       ]),

//       // Refunds by status
//       Refund.aggregate([
//         { $match: dateFilter },
//         {
//           $group: {
//             _id: '$status',
//             count: { $sum: 1 }
//           }
//         }
//       ]),

//       // Financial calculations
//       Order.aggregate([
//         { $match: dateFilter },
//         {
//           $group: {
//             _id: null,
//             totalOrderAmount: { $sum: '$orderAmount' },
//             totalLessPrice: { $sum: '$lessPrice' },
//             totalOrders: { $sum: 1 }
//           }
//         }
//       ]),

//       // Orders by mediator (optimized)
//       Order.aggregate([
//         { $match: dateFilter },
//         {
//           $lookup: {
//             from: 'users',
//             localField: 'mediator',
//             foreignField: '_id',
//             as: 'mediatorInfo',
//             pipeline: [
//               { $project: { nickName: 1, name: 1 } }
//             ]
//           }
//         },
//         {
//           $group: {
//             _id: '$mediator',
//             count: { $sum: 1 },
//             mediatorName: { 
//               $first: { 
//                 $ifNull: [
//                   { $arrayElemAt: ['$mediatorInfo.nickName', 0] },
//                   { $arrayElemAt: ['$mediatorInfo.name', 0] },
//                   'Unknown'
//                 ]
//               }
//             }
//           }
//         },
//         { $sort: { count: -1 } }
//       ]),

//       // Orders by seller (optimized)
//       Order.aggregate([
//         { $match: dateFilter },
//         {
//           $lookup: {
//             from: 'products',
//             localField: 'product',
//             foreignField: '_id',
//             as: 'productInfo',
//             pipeline: [
//               { 
//                 $lookup: {
//                   from: 'users',
//                   localField: 'seller',
//                   foreignField: '_id',
//                   as: 'sellerInfo',
//                   pipeline: [
//                     { $project: { name: 1, nickName: 1 } }
//                   ]
//                 }
//               },
//               { $project: { seller: 1, sellerInfo: 1 } }
//             ]
//           }
//         },
//         { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
//         {
//           $group: {
//             _id: '$productInfo.seller',
//             count: { $sum: 1 },
//             sellerName: {
//               $first: {
//                 $ifNull: [
//                   { $arrayElemAt: ['$productInfo.sellerInfo.nickName', 0] },
//                   { $arrayElemAt: ['$productInfo.sellerInfo.name', 0] },
//                   'Unknown'
//                 ]
//               }
//             }
//           }
//         },
//         { $sort: { count: -1 } }
//       ])
//     ]);

//     // Convert orders by status to object format
//     const ordersStatusCount = {
//       accepted: 0,
//       pending: 0,
//       rejected: 0,
//       payment_done: 0,
//       refund_placed: 0,
//       refill: 0
//     };

//     ordersByStatus.forEach(item => {
//       if (item._id && ordersStatusCount.hasOwnProperty(item._id)) {
//         ordersStatusCount[item._id] = item.count;
//       }
//     });

//     // Convert refunds by status to object format
//     const refundsStatusCount = {
//       accepted: 0,
//       pending: 0,
//       rejected: 0,
//       payment_done: 0
//     };

//     refundsByStatus.forEach(item => {
//       if (item._id && refundsStatusCount.hasOwnProperty(item._id)) {
//         refundsStatusCount[item._id] = item.count;
//       }
//     });

//     // Financial data
//     const financialData = financialStats[0] || {
//       totalOrderAmount: 0,
//       totalLessPrice: 0,
//       totalOrders: 0
//     };

//     const refundAmount = financialData.totalOrderAmount - financialData.totalLessPrice;

//     // Additional metrics
//     const additionalMetrics = await Promise.all([
//       // Today's orders
//       Order.countDocuments({
//         ...dateFilter,
//         createdAt: { 
//           $gte: new Date(new Date().setHours(0, 0, 0, 0)),
//           $lte: new Date()
//         }
//       }),
      
//       // This week's orders
//       Order.countDocuments({
//         ...dateFilter,
//         createdAt: { 
//           $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
//           $lte: new Date()
//         }
//       }),
      
//       // Average order value by status
//       Order.aggregate([
//         { $match: dateFilter },
//         {
//           $group: {
//             _id: '$orderStatus',
//             averageAmount: { $avg: '$orderAmount' },
//             totalAmount: { $sum: '$orderAmount' },
//             count: { $sum: 1 }
//           }
//         }
//       ])
//     ]);

//     const [todayOrders, thisWeekOrders, orderMetrics] = additionalMetrics;

//     const response = {
//       summary: {
//         totalOrders,
//         totalRefunds,
//         totalProducts,
//         totalMediators,
//         totalSellers,
//         totalUsers,
//         todayOrders,
//         thisWeekOrders
//       },
//       statusCounts: {
//         orders: ordersStatusCount,
//         refunds: refundsStatusCount
//       },
//       financial: {
//         totalOrderAmount: financialData.totalOrderAmount,
//         totalLessPrice: financialData.totalLessPrice,
//         refundAmount,
//         averageOrderValue: totalOrders > 0 ? financialData.totalOrderAmount / totalOrders : 0,
//         orderMetrics: orderMetrics.reduce((acc, metric) => {
//           if (metric._id) {
//             acc[metric._id] = {
//               averageAmount: metric.averageAmount,
//               totalAmount: metric.totalAmount,
//               count: metric.count
//             };
//           }
//           return acc;
//         }, {})
//       },
//       performance: {
//         topMediators: ordersByMediator.map(item => ({
//           mediatorId: item._id,
//           mediatorName: item.mediatorName,
//           orderCount: item.count
//         })),
//         topSellers: ordersBySeller.map(item => ({
//           sellerId: item._id,
//           sellerName: item.sellerName,
//           orderCount: item.count
//         }))
//       },
//       dateRange: {
//         fromDate: fromDate || 'All time',
//         toDate: toDate || 'All time'
//       },
//       timestamp: new Date().toISOString()
//     };

//     res.status(200).json({
//       success: true,
//       message: 'Dashboard data fetched successfully',
//       data: response
//     });

//   } catch (error) {
//     console.error('Admin Dashboard Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching dashboard data',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// @desc get Admin Dashboard
// @route POST /api/admin/dashboard
// @access Private(Admin)
export const getAdminDashboard = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (fromDate && toDate) {
      const endDate = new Date(toDate);
      endDate.setHours(23,59,59,999);
      dateFilter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(endDate)
      };
    } else if (fromDate) {
      dateFilter.createdAt = { $gte: new Date(fromDate) };
    } else if (toDate) {
      dateFilter.createdAt = { $lte: new Date(toDate) };
    }

    // Run all queries concurrently for better performance
    const [
      totalOrders,
      totalRefunds,
      totalProducts,
      totalMediators,
      totalSellers,
      totalUsers,
      ordersByStatus,
      refundsByStatus,
      financialStats,
      ordersByMediator,
      ordersBySeller,
      paidRefundsStats // New query for paid refunds
    ] = await Promise.all([
      // Basic counts
      Order.countDocuments(dateFilter),
      Refund.countDocuments(dateFilter),
      Product.countDocuments(dateFilter),
      User.countDocuments({ ...dateFilter, role: 'mediator' }),
      User.countDocuments({ ...dateFilter, role: 'seller' }),
      User.countDocuments({ ...dateFilter, role: 'user' }),

      // Orders by status
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 }
          }
        }
      ]),

      // Refunds by status
      Refund.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      // Financial calculations for orders
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalOrderAmount: { $sum: '$orderAmount' },
            totalLessPrice: { $sum: '$lessPrice' },
            totalOrders: { $sum: 1 }
          }
        }
      ]),

      // Orders by mediator (optimized)
      Order.aggregate([
        { $match: dateFilter },
        {
          $lookup: {
            from: 'users',
            localField: 'mediator',
            foreignField: '_id',
            as: 'mediatorInfo',
            pipeline: [
              { $project: { nickName: 1, name: 1 } }
            ]
          }
        },
        {
          $group: {
            _id: '$mediator',
            count: { $sum: 1 },
            mediatorName: { 
              $first: { 
                $ifNull: [
                  { $arrayElemAt: ['$mediatorInfo.nickName', 0] },
                  { $arrayElemAt: ['$mediatorInfo.name', 0] },
                  'Unknown'
                ]
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // Orders by seller (optimized)
      Order.aggregate([
        { $match: dateFilter },
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'productInfo',
            pipeline: [
              { 
                $lookup: {
                  from: 'users',
                  localField: 'seller',
                  foreignField: '_id',
                  as: 'sellerInfo',
                  pipeline: [
                    { $project: { name: 1, nickName: 1 } }
                  ]
                }
              },
              { $project: { seller: 1, sellerInfo: 1 } }
            ]
          }
        },
        { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$productInfo.seller',
            count: { $sum: 1 },
            sellerName: {
              $first: {
                $ifNull: [
                  { $arrayElemAt: ['$productInfo.sellerInfo.nickName', 0] },
                  { $arrayElemAt: ['$productInfo.sellerInfo.name', 0] },
                  'Unknown'
                ]
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // NEW: Calculate total paid refunds amount
      Refund.aggregate([
        { 
          $match: { 
            ...dateFilter,
            status: 'payment_done' 
          } 
        },
        {
          $lookup: {
            from: 'orders',
            localField: 'order',
            foreignField: '_id',
            as: 'orderInfo',
            pipeline: [
              { $project: { orderAmount: 1, lessPrice: 1 } }
            ]
          }
        },
        { $unwind: { path: '$orderInfo', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: null,
            totalPaidRefunds: { $sum: 1 },
            totalPaidAmount: { 
              $sum: { 
                $subtract: [
                  '$orderInfo.orderAmount', 
                  '$orderInfo.lessPrice'
                ]
              }
            }
          }
        }
      ])
    ]);

    // Convert orders by status to object format
    const ordersStatusCount = {
      accepted: 0,
      pending: 0,
      rejected: 0,
      payment_done: 0,
      refund_placed: 0,
      refill: 0
    };

    ordersByStatus.forEach(item => {
      if (item._id && ordersStatusCount.hasOwnProperty(item._id)) {
        ordersStatusCount[item._id] = item.count;
      }
    });

    // Convert refunds by status to object format
    const refundsStatusCount = {
      accepted: 0,
      pending: 0,
      rejected: 0,
      payment_done: 0
    };

    refundsByStatus.forEach(item => {
      if (item._id && refundsStatusCount.hasOwnProperty(item._id)) {
        refundsStatusCount[item._id] = item.count;
      }
    });

    // Financial data
    const financialData = financialStats[0] || {
      totalOrderAmount: 0,
      totalLessPrice: 0,
      totalOrders: 0
    };

    const refundAmount = financialData.totalOrderAmount - financialData.totalLessPrice;

    // Paid refunds data
    const paidRefundsData = paidRefundsStats[0] || {
      totalPaidRefunds: 0,
      totalPaidAmount: 0
    };

    // Additional metrics
    const additionalMetrics = await Promise.all([
      // Today's orders
      Order.countDocuments({
        ...dateFilter,
        createdAt: { 
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date()
        }
      }),
      
      // This week's orders
      Order.countDocuments({
        ...dateFilter,
        createdAt: { 
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          $lte: new Date()
        }
      }),
      
      // Average order value by status
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$orderStatus',
            averageAmount: { $avg: '$orderAmount' },
            totalAmount: { $sum: '$orderAmount' },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const [todayOrders, thisWeekOrders, orderMetrics] = additionalMetrics;

    const response = {
      summary: {
        totalOrders,
        totalRefunds,
        totalProducts,
        totalMediators,
        totalSellers,
        totalUsers,
        todayOrders,
        thisWeekOrders,
        totalPaidRefunds: paidRefundsData.totalPaidRefunds // Add paid refunds count
      },
      statusCounts: {
        orders: ordersStatusCount,
        refunds: refundsStatusCount
      },
      financial: {
        totalOrderAmount: financialData.totalOrderAmount,
        totalLessPrice: financialData.totalLessPrice,
        refundAmount,
        totalPaidRefundAmount: paidRefundsData.totalPaidAmount, // Add paid refunds amount
        averageOrderValue: totalOrders > 0 ? financialData.totalOrderAmount / totalOrders : 0,
        orderMetrics: orderMetrics.reduce((acc, metric) => {
          if (metric._id) {
            acc[metric._id] = {
              averageAmount: metric.averageAmount,
              totalAmount: metric.totalAmount,
              count: metric.count
            };
          }
          return acc;
        }, {})
      },
      performance: {
        topMediators: ordersByMediator.map(item => ({
          mediatorId: item._id,
          mediatorName: item.mediatorName,
          orderCount: item.count
        })),
        topSellers: ordersBySeller.map(item => ({
          sellerId: item._id,
          sellerName: item.sellerName,
          orderCount: item.count
        }))
      },
      dateRange: {
        fromDate: fromDate || 'All time',
        toDate: toDate || 'All time'
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: response
    });

  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all filter options for orders
// @route   GET /api/order/filter-options
// @access  Private(admin)
export const getAllFiltersData = async (req, res) => {
  try {
    // Get all unique values concurrently for better performance
    const [
      mediators,
      sellers,
      products,
      platforms
    ] = await Promise.all([
      // Get all mediators (users with role 'mediator')
      User.find({ role: 'mediator', isActive: true , isVerified:true })
        .select('_id name nickName email')
        .sort({ name: 1 })
        .lean(),

      // Get all sellers (users with role 'seller')
      User.find({ role: 'seller', isActive: true , isVerified:true})
        .select('_id name nickName email')
        .sort({ name: 1 })
        .lean(),

      // Get all active products
      Product.find({ isActive: true })
        .select('_id name brand productCode')
        .populate('seller', 'name nickName')
        .sort({ name: 1 })
        .lean(),

      // Get all unique platforms from products
      Product.distinct('productPlatform', { isActive: true })
    ]);

    // Format the data for frontend
    const filterOptions = {
      mediators: mediators.map(mediator => ({
        _id: mediator._id,
        name: mediator.nickName || mediator.name,
        email: mediator.email
      })),
      
      sellers: sellers.map(seller => ({
        _id: seller._id,
        name: seller.nickName || seller.name,
        email: seller.email
      })),
      
      products: products.map(product => ({
        _id: product._id,
        name: product.name,
        brand: product.brand,
        productCode: product.productCode
      })),
      
      platforms: platforms
        .filter(platform => platform && platform.trim() !== '')
        .sort()
        .map(platform => ({
          name: platform,
          value: platform
        }))
    };

    res.status(200).json({
      success: true,
      message: 'Filter options retrieved successfully',
      data: filterOptions
    });

  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching filter options'
    });
  }
};