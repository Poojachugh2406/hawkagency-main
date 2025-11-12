import Refund from '../models/Refund.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
// @desc    Create new refund
// @route   POST /api/refunds
// @access  Public
export const createRefund = async (req, res) => {
  try {
    // console.log('Refund creation request received:', {
    //   hasData: !!req.body.data,
    //   hasFiles: !!req.files,
    //   fileCount: req.files ? Object.keys(req.files).length : 0
    // });

    const refundData = req.body.data;

    if (!refundData) {
      return res.status(400).json({
        success: false,
        message: 'Refund data is required'
      });
    }

    // Handle file uploads
    if (req.files?.deliveredSS?.[0]) {
      refundData.deliveredSS = req.files.deliveredSS[0].path || req.files.deliveredSS[0].secure_url;
    }
    if (req.files?.reviewSS?.[0]) {
      refundData.reviewSS = req.files.reviewSS[0].path || req.files.reviewSS[0].secure_url;
    }
    if (req.files?.sellerFeedbackSS?.[0]) {
      refundData.sellerFeedbackSS = req.files.sellerFeedbackSS[0].path || req.files.sellerFeedbackSS[0].secure_url;
    }

    // Validate required fields
    if (!refundData.order) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Validate order exists
    const isOrderExists = await Order.findById(refundData.order);
    if (!isOrderExists) {
      return res.status(400).json({
        success: false,
        message: 'Order doesnt exists with this id. Please try again.'
      });
    }

    if(isOrderExists.orderStatus ==='rejected'){
      return res.status(400).json({
        success:false,
        message:'This Order is Rejected by Admin'
      })
    }


    // console.log('Processing refund for order:', refundData.order);

    // Check if refund already exists for this order
    const existingRefund = await Refund.findOne({ order: refundData.order });
    if (existingRefund) {
      return res.status(409).json({
        success: false,
        message: 'Refund already exists for this order. Please update the existing refund.',
        data: {
          existingRefundId: existingRefund._id,
          status: existingRefund.status
        }
      });
    }

    

    const newRefund = new Refund(refundData);
    const refund = await newRefund.save();
    isOrderExists.orderStatus = 'refund_placed';
    await isOrderExists.save();
    console.log('Refund created successfully:', refund._id);
    // Populate order details
    await refund.populate('order', 'orderNumber name email phone orderAmount');
    res.status(201).json({
      success: true,
      message: 'Refund created successfully',
      data: refund
    });

  } catch (error) {
    console.error('Create refund error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Refund already exists for this order'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating refund',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all refunds for a specific mediator
// @route   GET /api/refund/user/all-refunds
// @access  Private
export const getAllUserRefunds = async (req, res) => {
  try {

    // Find all orders for this user
    const userOrders = await Order.find({ email: req.user.email }).select('_id');
    const orderIds = userOrders.map(order => order._id)

    // Find refunds for orders belonging to this mediator
    const refunds = await Refund.find({ order: { $in: orderIds } })
      .populate({
        path: 'order',
        select: 'orderNumber name email phone orderAmount mediator product',
        populate: [
          {
            path: 'mediator',
            select: 'name nickName'
          },
          {
            path: 'product',
            select: 'name brand productPlatform'
          }
        ]
      })
      .sort({ createdAt: -1 });

    const allRefunds = refunds.map(refund => {
      return {
        order: refund.order,
        _id: refund._id,
        status: refund.status,
        rejectionMessage: refund.rejectionMessage,
        createdAt: refund.createdAt,

      }
    });

    res.status(200).json({
      success: true,
      message: 'Refunds retrieved successfully',
      data: allRefunds,
      count: refunds.length
    });

  } catch (error) {
    console.error('Get user refunds error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching refunds'
    });
  }
};
// @desc    Get all refunds for a specific mediator
// @route   GET /api/refund/mediator/all-refunds
// @access  Private
export const getAllMediatorRefunds = async (req, res) => {
  try {
    const mediatorId = req.user._id; // Get the mediator ID from the authenticated user

    // Find all orders for this mediator
    const mediatorOrders = await Order.find({ mediator: mediatorId }).select('_id');
    const orderIds = mediatorOrders.map(order => order._id);

    // Find refunds for orders belonging to this mediator
    const refunds = await Refund.find({ order: { $in: orderIds } })
      .populate({
        path: 'order',
        select: 'orderNumber name email phone orderAmount mediator product',
        populate: [
          {
            path: 'mediator',
            select: 'name nickName'
          },
          {
            path: 'product',
            select: 'name brand'
          }
        ]
      })
      .sort({ createdAt: -1 });

    const allRefunds = refunds.map(refund => {
      return {
        order: refund.order,
        _id: refund._id,
        status: refund.status,
        createdAt: refund.createdAt,
      }
    });

    res.status(200).json({
      success: true,
      message: 'Refunds retrieved successfully',
      data: allRefunds,
      count: refunds.length
    });

  } catch (error) {
    console.error('Get mediator refunds error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching refunds'
    });
  }
};
// @desc    Get all refunds
// @route   GET /api/refunds
// @access  Private
// export const getAllRefundsslowvala = async (req, res) => {
//   try {
//     const refunds = await Refund.find()
//       .populate({
//         path: 'order',
//         select: 'orderNumber name email phone orderAmount mediator product',
//         populate: [
//           {
//             path: 'mediator',
//             select: 'nickName '
//           },
//           {
//             path: 'product',
//             select: 'name brand productPlatform productCode brandCode',
//             populate: [
//               {
//                 path: 'seller',
//                 select: 'name email'
//               }
//             ]
//           }
//         ]
//       })
//       .sort({ createdAt: -1 });

//     const allRefunds = refunds.map(refund => {
//       return {
//         order: refund.order,
//         _id: refund._id,
//         status: refund.status,
//         createdAt: refund.createdAt,
//       }
//     })
//     res.status(200).json({
//       success: true,
//       message: 'Refunds retrieved successfully',
//       data: allRefunds,
//       count: refunds.length
//     });

//   } catch (error) {
//     console.error('Get refunds error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching refunds'
//     });
//   }
// };


// @desc    Get all refunds with filters and pagination
// @route   GET /api/refunds
// @access  Private
export const getAllRefunds = async (req, res) => {
  try {
    // --- 1. Get Query Params ---
    const {
      page,
      limit,
      status,
      mediator,
      seller,
      product,
      platform,
      fromDate,
      toDate,
      searchTerm, // <-- ADDED
    } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5; // Using 5 as in your example
    const skip = (pageNum - 1) * limitNum;

    // --- 2. Build Filter Stages ---

    // Initial match (on Refund model) - fast!
    const initialMatch = {};
    if (status) {
      initialMatch.status = status;
    }

    // Date range filter
    if (fromDate || toDate) {
      initialMatch.createdAt = {};
      if (fromDate) {
        initialMatch.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        // Set to end of the day
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        initialMatch.createdAt.$lte = endDate;
      }
    }

    // Final match (on populated data)
    const finalMatch = {};
    if (mediator) {
      finalMatch['order.mediator._id'] = new mongoose.Types.ObjectId(mediator);
    }
    if (product) {
      finalMatch['order.product._id'] = new mongoose.Types.ObjectId(product);
    }
    if (seller) {
      finalMatch['order.product.seller._id'] = new mongoose.Types.ObjectId(seller);
    }
    if (platform) {
      finalMatch['order.product.productPlatform'] = platform;
    }

    // --- ADDED SEARCH LOGIC ---
    if (searchTerm) {
      finalMatch.$or = [
        { 'order.orderNumber': { $regex: searchTerm, $options: 'i' } },
        { 'order.name': { $regex: searchTerm, $options: 'i' } }, // Reviewer Name
      ];
    }
    // --- END OF ADDED LOGIC ---

    // --- 3. Build Aggregation Pipeline ---
    const pipeline = [
      // Stage 1: Filter Refunds (fast)
      { $match: initialMatch },

      // Stage 2: Join with Orders
      {
        $lookup: {
          from: 'orders', // collection name
          localField: 'order',
          foreignField: '_id',
          as: 'order',
        },
      },
      // Unwind the 'order' array
      { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },

      // Stage 3: Join with Products
      {
        $lookup: {
          from: 'products',
          localField: 'order.product',
          foreignField: '_id',
          as: 'order.product',
        },
      },
      { $unwind: { path: '$order.product', preserveNullAndEmptyArrays: true } },

      // Stage 4: Join with Mediators
      {
        $lookup: {
          from: 'users',
          localField: 'order.mediator',
          foreignField: '_id',
          as: 'order.mediator',
        },
      },
      { $unwind: { path: '$order.mediator', preserveNullAndEmptyArrays: true } },

      // Stage 5: Join with Sellers
      {
        $lookup: {
          from: 'users',
          localField: 'order.product.seller',
          foreignField: '_id',
          as: 'order.product.seller',
        },
      },
      { $unwind: { path: '$order.product.seller', preserveNullAndEmptyArrays: true } },

      // Stage 6: Filter on populated data (now includes search)
      { $match: finalMatch },

      // Stage 7: Sort
      { $sort: { createdAt: -1 } },

      // Stage 8: Facet for Pagination and Data
      {
        $facet: {
          // Sub-pipeline 1: Get total count
          metadata: [{ $count: 'total' }],
          // Sub-pipeline 2: Get paginated data
          data: [
            { $skip: skip },
            { $limit: limitNum },
            // Project the final shape
            {
              $project: {
                // Refund fields
                _id: 1,
                status: 1,
                createdAt: 1,
                upiId: 1, // Include other refund fields you need
                bankInfo: 1,
                reviewLink: 1,
                deliveredSS: 1,
                reviewSS: 1,
                sellerFeedbackSS: 1,
                returnWindowSS: 1,
                rejectionMessage: 1,
                note: 1,
                isReturnWindowClosed: 1,

                // Order field (as an object)
                order: {
                  _id: '$order._id',
                  orderNumber: '$order.orderNumber',
                  name: '$order.name',
                  email: '$order.email',
                  phone: '$order.phone',
                  orderAmount: '$order.orderAmount',
                  // Nested Mediator
                  mediator: {
                    _id: '$order.mediator._id',
                    nickName: '$order.mediator.nickName',
                  },
                  // Nested Product
                  product: {
                    _id: '$order.product._id',
                    name: '$order.product.name',
                    brand: '$order.product.brand',
                    productPlatform: '$order.product.productPlatform',
                    productCode: '$order.product.productCode',
                    brandCode: '$order.product.brandCode',
                    // Nested Seller
                    seller: {
                      _id: '$order.product.seller._id',
                      name: '$order.product.seller.name',
                      email: '$order.product.seller.email',
                    },
                  },
                },
              },
            },
          ],
        },
      },
    ];

    // --- 4. Execute Pipeline ---
    const results = await Refund.aggregate(pipeline);

    const refunds = results[0].data;
    const totalCount = results[0].metadata[0] ? results[0].metadata[0].total : 0;

    // --- 5. Send Response ---
    res.status(200).json({
      success: true,
      message: 'Refunds retrieved successfully',
      data: refunds,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
        hasNextPage: pageNum * limitNum < totalCount,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Get refunds error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching refunds',
    });
  }
};
// @desc    Get single refund by ID
// @route   GET /api/refund/:id
// @access  Private
export const getRefundById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund ID format.'
      });
    }

    const refund = await Refund.findById(id)
      .populate({
        path: 'order',
        select: 'orderNumber oldOrderNumber name email phone orderAmount lessPrice orderDate createdAt orderSS priceBreakupSS orderStatus rejectionMessage dealType exchangeProduct isReplacement ratingOrReview note',
        populate: [
          {
            path: 'mediator',
            select: 'nickName email phone'
          },
          {
            path: 'product',
            select: 'name brand productCode brandCode productLink productPlatform'
          }
        ]
      });

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: 'Refund not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Refund retrieved successfully',
      data: refund
    });

  } catch (error) {
    console.error('Get refund error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching refund'
    });
  }
};

// @desc    Update refund
// @route   PUT /api/refunds/:id
// @access  Private
export const updateRefund = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund ID format.'
      });
    }

    const updateFields = { ...req.body.data };
    // Handle file uploads for update
    if (req.files?.deliveredSS?.[0]) {
      updateFields.deliveredSS = req.files.deliveredSS[0].path || req.files.deliveredSS[0].secure_url;
    }
    if (req.files?.reviewSS?.[0]) {
      updateFields.reviewSS = req.files.reviewSS[0].path || req.files.reviewSS[0].secure_url;
    }
    if (req.files?.sellerFeedbackSS?.[0]) {
      updateFields.sellerFeedbackSS = req.files.sellerFeedbackSS[0].path || req.files.sellerFeedbackSS[0].secure_url;
    }
    if (req.files?.returnWindowSS?.[0]) {
      updateFields.returnWindowSS = req.files.returnWindowSS[0].path || req.files.returnWindowSS[0].secure_url;
    }

    // Create update object with only the fields that are present in req.body

    // Remove id from update fields
    delete updateFields.id;

    // Validate order if being updated
    if (updateFields.order) {
      const isOrderExists = await Order.findById(updateFields.order);
      if (!isOrderExists) {
        return res.status(400).json({
          success: false,
          message: 'Order doesnt exists with this id. Please try again.'
        });
      }

      // Check if another refund already exists for the new order
      const existingRefund = await Refund.findOne({
        order: updateFields.order,
        _id: { $ne: id }
      });
      if (existingRefund) {
        return res.status(400).json({
          success: false,
          message: 'Another refund already exists for this order'
        });
      }
    }
    console.log(updateFields);
    const updatedRefund = await Refund.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: 'order',
        select: 'orderNumber oldOrderNumber name email phone orderAmount lessPrice orderDate createdAt orderSS priceBreakupSS orderStatus rejectionMessage dealType exchangeProduct isReplacement ratingOrReview note',
        populate: [
          {
            path: 'mediator',
            select: 'nickName name email phone'
          },
          {
            path: 'product',
            select: 'name brand productCode brandCode productLink productPlatform'
          }
        ]
      });

    if (!updatedRefund) {
      return res.status(404).json({
        success: false,
        message: 'Refund not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Refund updated successfully',
      data: updatedRefund
    });

  } catch (error) {
    console.error('Error updating refund:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating refund'
    });
  }
};

// @desc    Delete refund
// @route   DELETE /api/refunds/:id
// @access  Private
export const deleteRefund = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund ID format.'
      });
    }

    const deletedRefund = await Refund.findByIdAndDelete(id);

    if (!deletedRefund) {
      return res.status(404).json({
        success: false,
        message: 'Refund not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Refund deleted successfully',
      data: {
        _id: deletedRefund._id,
        order: deletedRefund.order
      }
    });

  } catch (error) {
    console.error('Error deleting refund:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting refund'
    });
  }
};

// @desc    Update refund status
// @route   PATCH /api/refunds/:id/status
// @access  Private
export const updateRefundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionMessage, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund ID format.'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Refund status is required'
      });
    }

    const validStatuses = ['accepted', 'rejected', 'pending', 'payment_done' , 'refill'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund status'
      });
    }

    const updateData = { status };

    // Add rejection message if status is rejected
    if (status === 'rejected' && rejectionMessage) {
      updateData.rejectionMessage = rejectionMessage;
    }

    // Add note if provided
    if (note) {
      updateData.note = note;
    }

    const updatedRefund = await Refund.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'order',
        select: 'orderNumber name email phone orderAmount mediator product orderDate orderStatus',
        populate: [
          {
            path: 'mediator',
            select: 'name nickName email phone'
          },
          {
            path: 'product',
            select: 'name brand productPlatform '
          }
        ]
      });

    if (!updatedRefund) {
      return res.status(404).json({
        success: false,
        message: 'Refund not found'
      });
    }
    await Order.findByIdAndUpdate(updatedRefund.order._id, { $set: { orderStatus: status } });
    res.status(200).json({
      success: true,
      message: `Refund status updated to ${status} successfully`,
      data: updatedRefund
    });

  } catch (error) {
    console.error('Error updating refund status:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund ID format'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating refund status'
    });
  }
};


// @desc    Verify order for refund
// @route   POST /api/refund/verify
// @access  Public
export const verifyOrderForRefund = async (req, res) => {
  try {
    const { orderNumber } = req.body;
    const order = await Order.findOne({ orderNumber: orderNumber.toUpperCase() })
      .populate('mediator', 'nickName')
      .populate('product', 'brandCode productCode');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is eligible for refund
    if (order.status === 'payment_done') {
      return res.status(400).json({
        success: false,
        message: 'This order has been Paid refund and is not eligible for refund'
      });
    }

    if (order.status === 'rejected') {
      return res.status(500).json({
        success: false,
        message: "This Order is Rejected by Admin"
      })
    }


    const refundExists = await Refund.findOne({ order: order._id });
    if (refundExists) {
      return res.status(409).json({
        success: false,
        message: 'Refund already exists for this order'
      });
    }

    console.log(order);
    res.status(200).json({
      success: true,
      message: 'Order verified successfully',
      data: {
        order: order._id,
        orderNumber: order.orderNumber,
        brandCode: order.product.brandCode,
        productCode: order.product.productCode,
        name: order.name,
        email: order.email,
        phone: order.phone,
        orderAmount: order.orderAmount,
        lessPrice: order.lessPrice,
        mediatorName: order.mediator.nickName,
        createdAt: order.createdAt
        // product: order.product,
        // mediator:order.mediator,
        // orderAmount: order.orderAmount,
        // name:order.name,
        // phone:order.phone,
        // email:order.email,
        // lessPrice:order.lessPrice,
      }
    });
  } catch (error) {
    console.error('Verify order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying order'
    });
  }
};


// @desc    Get all refund forms with filters and search
// @route   GET /api/refund/download
// @access  Private/Admin
export const getRefundsForDownload = async (req, res) => {
  try {
    const {
      searchQuery,
      product,
      platform,
      mediator,
      status,
      dealType,
      isReplacement,
      ratingOrReview,
      fromDate,
      toDate,
      seller,
    } = req.query;

    // Build filter object for orders
    let orderFilter = {};

    // Search query across multiple fields in Order
    if (searchQuery) {
      orderFilter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { orderNumber: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Product filter
    if (product) {
      orderFilter.product = product;
    }

    // Mediator filter
    if (mediator) {
      orderFilter.mediator = mediator;
    }


    // Deal type filter
    if (dealType) {
      orderFilter.dealType = dealType;
    }

    // Replacement filter
    if (isReplacement) {
      orderFilter.isReplacement = isReplacement;
    }

    // Rating/Review filter
    if (ratingOrReview) {
      orderFilter.ratingOrReview = ratingOrReview;
    }

    // Date range filter for order date
    

    // Build refund filter
    let refundFilter = {};

    // Refund status filter
    if (status) {
      refundFilter.status = status;
    }

    if (fromDate || toDate) {
      refundFilter.createdAt = {};
      if (fromDate) {
        refundFilter.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        refundFilter.createdAt.$lte = endOfDay;
      }
    }

    // Get refunds with populated references
    let refunds = await Refund.find(refundFilter)
      .populate({
        path: 'order',
        match: orderFilter,
        populate: [
          {
            path: 'product',
            select: 'name brand productCode productPlatform ratingSlots reviewSlots seller'
          },
          {
            path: 'mediator',
            select: 'name email phone nickName'
          }
        ]
      })
      .sort({ createdAt: -1 });

    // Filter out refunds where order doesn't match the filters (due to population match)
    refunds = refunds.filter(refund => refund.order !== null);

    // Apply platform filter after population
    if (platform) {
      refunds = refunds.filter(refund =>
        refund.order &&
        refund.order.product &&
        refund.order.product.productPlatform &&
        refund.order.product.productPlatform.toLowerCase() === platform.toLowerCase()
      );
    }

    // Format the response data
    const formattedRefunds = refunds.map(refund =>{
      if (!seller || seller === refund?.order?.product?.seller?.toString()) {
        return {
          _id: refund._id,
          orderNumber: refund.order?.orderNumber || 'N/A',
          oldOrderNumber: refund.order?.oldOrderNumber || '',
          orderDate: refund.order?.orderDate ? refund.order.orderDate.toISOString().split('T')[0] : 'N/A',
          orderStatus: refund.order?.orderStatus || 'N/A',
          customerName: refund.order?.name || 'N/A',
          customerEmail: refund.order?.email || 'N/A',
          customerPhone: refund.order?.phone || 'N/A',
          productName: refund.order?.product?.name || 'N/A',
          productBrand: refund.order?.product?.brand || 'N/A',
          productCode: refund.order?.product?.productCode || 'N/A',
          platform: refund.order?.product?.productPlatform || 'N/A',
          mediatorName: refund.order?.mediator?.nickName || refund.order?.mediator?.name || 'N/A',
          mediatorEmail: refund.order?.mediator?.email || 'N/A',
          orderAmount: refund.order?.orderAmount || 0,
          lessPrice: refund.order?.lessPrice || 0,
          dealType: refund.order?.dealType || 'N/A',
          exchangeProduct: refund.order?.exchangeProduct || '',
          isReplacement: refund.order?.isReplacement || 'N/A',
          ratingOrReview: refund.order?.ratingOrReview || 'N/A',

          // Refund specific fields
          refundStatus: refund.status,
          upiId: refund.upiId || '',
          bankInfo: refund.bankInfo || {},
          reviewLink: refund.reviewLink || '',
          deliveredSS: refund.deliveredSS || '',
          reviewSS: refund.reviewSS || '',
          sellerFeedbackSS: refund.sellerFeedbackSS || '',
          returnWindowSS: refund.returnWindowSS || '',
          rejectionMessage: refund.rejectionMessage || '',
          note: refund.note || '',
          isReturnWindowClosed: refund.isReturnWindowClosed || false,
          createdAt: refund.createdAt,
          updatedAt: refund.updatedAt
        }
      }
    }).filter(refund =>refund);

    res.status(200).json({
      success: true,
      count: formattedRefunds.length,
      data: formattedRefunds
    });

  } catch (error) {
    console.error('Error fetching refunds:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching refund forms',
      error: error.message
    });
  }
};



// @desc    Get single refund by ID
// @route   GET /api/refund/:id
// @access  Private
export const getRefundByOrder = async (req, res) => {
  try {
    const { order } = req.params;

    if (!mongoose.Types.ObjectId.isValid(order)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.'
      });
    }

    const refund = await Refund.findOne({order})
      .populate({
        path: 'order',
        select: 'orderNumber oldOrderNumber name email phone orderAmount lessPrice orderDate createdAt orderSS priceBreakupSS orderStatus rejectionMessage dealType exchangeProduct isReplacement ratingOrReview note',
        populate: [
          {
            path: 'mediator',
            select: 'nickName email phone'
          },
          {
            path: 'product',
            select: 'name brand productCode brandCode productLink productPlatform'
          }
        ]
      });

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: 'Refund not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Refund retrieved successfully',
      data: refund
    });

  } catch (error) {
    console.error('Get refund error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching refund'
    });
  }
};
