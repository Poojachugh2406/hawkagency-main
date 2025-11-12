import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Refund from '../models/Refund.js';
import User from '../models/User.js';
import { MEDIATOR } from '../utils/constants.js';
import mongoose from 'mongoose';

// @desc    Create new order
// @route   POST /api/order/create-order
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const orderData = req.body.data;

    // Handle file uploads
    if (req.files?.orderSS?.[0]) {
      orderData.orderSS = req.files.orderSS[0].path || req.files.orderSS[0].secure_url;
    }
    if (req.files?.priceBreakupSS?.[0]) {
      orderData.priceBreakupSS = req.files.priceBreakupSS[0].path || req.files.priceBreakupSS[0].secure_url;
    }


    const [isMediatorExists, isProductExists, isOrderExists] = await Promise.all([
      User.findOne({ _id: orderData.mediator, role: MEDIATOR }).select('_id').lean(),
      Product.findOne({ _id: orderData.product }).select('_id').lean(),
      Order.findOne({ orderNumber: orderData.orderNumber }).select('_id').lean()
    ]);

    // Validate mediator exists
    // const isMediatorExists = await User.findOne({ _id: orderData.mediator, role: MEDIATOR });
    if (!isMediatorExists) {
      return res.status(400).json({
        success: false,
        message: 'Mediator doesnt exists with this id. Please try again.'
      });
    }

    // Validate product exists
    // const isProductExists = await Product.findOne({ _id: orderData.product });
    if (!isProductExists) {
      return res.status(400).json({
        success: false,
        message: 'Product doesnt exists with this id. Please try again.'
      });
    }

    // Check for duplicate order number
    // const isOrderExists = await Order.findOne({ orderNumber: orderData.orderNumber });
    if (isOrderExists) {
      return res.status(400).json({
        success: false,
        message: 'Order Already exists with this Order number, do edit it for modification'
      });
    }

    const newOrder = new Order(orderData);
    await newOrder.save();
    // const order = await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      // data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Order number already exists. Please try again.'
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
      message: 'Server error while creating order'
    });
  }
};

// @desc    Get all orders for sellers
// @route   GET /api/order/seller/all-orders
// @access  Private(seller)
export const getSellerOrders = async (req, res) => {
  try {
    // Get the seller ID from the authenticated user
    const sellerId = req.user._id;

    // Find all products belonging to this seller
    const sellerProducts = await Product.find({ seller: sellerId }).select('_id');
    
    if (!sellerProducts || sellerProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Products found",
        data: [],
      });
    }

    // Extract product IDs
    const productIds = sellerProducts.map(product => product._id);
    // Find all orders that contain these product IDs
    const orders = await Order.find({ product : { $in: productIds } })
      .populate('product', 'name brand productCode brandCode productPlatform')
      .populate('mediator', 'name nickName email phone')
      .sort({ createdAt: -1 }); // Sort by latest orders first


    res.status(200).json({
      success: true,
      message: "Seller orders retrieved successfully",
      data: orders,
      sellerId: sellerId
    });

  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// @desc    Get all orders with filtering and pagination
// @route   GET /api/order/mediator/all-orders
// @access  Private(mediator)
export const getMediatorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ mediator: req.user._id })
      .populate({
        path: 'product',
        select: 'name brand productPlatform productCode brandCode seller',
        populate: {
          path: 'seller',
          select: 'name nickName email phone'
        }
      })
      .populate('mediator', 'nickName name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};



// @desc    Get all orders with filtering and pagination
// @route   GET /api/order/user/all-orders
// @access  Private(user)
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ email: req.user.email })
      .populate('product', 'name brand productCode brandCode productPlatform ')
      .populate('mediator', 'nickName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Get all orders 
// @route   GET /api/order/all-orders
// @access  Private(admin)
// export const getAllOrdersSlowvala = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate({
//         path: 'product',
//         select: 'name brand productPlatform productCode brandCode seller',
//         populate: {
//           path: 'seller',
//           select: 'name nickName email phone'
//         }
//       })
//       .populate('mediator', 'nickName')
//       .sort({ createdAt: -1 });


//     const allOrders = orders.map(order => {
//       return {
//         product: order.product,
//         mediator: order.mediator,
//         _id: order._id,
//         orderNumber: order.orderNumber,
//         orderDate: order.orderDate,
//         orderAmount: order.orderAmount,
//         createdAt: order.createdAt,
//         name: order.name,
//         orderStatus: order.orderStatus,
//       }
//     });


//     res.status(200).json({
//       success: true,
//       message: 'Orders retrieved successfully',
//       data: allOrders,
//     });

//   } catch (error) {
//     console.error('Get orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching orders'
//     });
//   }
// };


// @desc    Get all orders with filtering (accurate count version)
// @route   GET /api/order/all-orders
// @access  Private(admin)
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      searchTerm,
      status,
      product,
      brand,
      mediator,
      seller,
      platform,
      fromDate,
      toDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build base filter
    const filter = {};

    // Text search
    if (searchTerm) {
      filter.$or = [
        { orderNumber: { $regex: searchTerm, $options: 'i' } },
        { name: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    if (status) filter.orderStatus = status;
    if (product && mongoose.Types.ObjectId.isValid(product)) filter.product = product;
    if (mediator && mongoose.Types.ObjectId.isValid(mediator)) filter.mediator = mediator;

    // Date range
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999); // set to maximum time of the day
        filter.createdAt.$lte = endOfDay;
      }
    }

    // Build product match condition for populate
    const productMatch = {};
    if (brand) productMatch.brand = { $regex: brand, $options: 'i' };
    if (platform) productMatch.productPlatform = { $regex: platform, $options: 'i' };

    const populateConditions = [
      {
        path: 'product',
        select: 'name brand productCode brandCode productPlatform seller',
        match: Object.keys(productMatch).length > 0 ? productMatch : {},
        populate: {
          path: 'seller',
          select: 'name nickName',
          match: seller && mongoose.Types.ObjectId.isValid(seller) ? { _id: seller } : {}
        }
      },
      {
        path: 'mediator',
        select: 'nickName'
      }
    ];

    // Get orders
    const orders = await Order.find(filter)
      .populate(populateConditions)
      .select('orderNumber orderDate orderAmount orderStatus name email phone dealType ratingOrReview createdAt')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Filter out orders where populate conditions didn't match
    const filteredOrders = orders.filter(order => 
      order.product && 
      (!brand || order.product.brand?.toLowerCase().includes(brand.toLowerCase())) &&
      (!platform || order.product.productPlatform?.toLowerCase().includes(platform.toLowerCase())) &&
      (!seller || order.product.seller?._id?.toString() === seller)
    );

    // Get accurate total count considering all filters
    let totalCount;
    if (brand || platform || seller) {
      // When we have complex filters, we need to count differently
      const allOrders = await Order.find(filter)
        .populate(populateConditions)
        .select('_id')
        .lean();
      
      const allFilteredOrders = allOrders.filter(order => 
        order.product && 
        (!brand || order.product.brand?.toLowerCase().includes(brand.toLowerCase())) &&
        (!platform || order.product.productPlatform?.toLowerCase().includes(platform.toLowerCase())) &&
        (!seller || order.product.seller?._id?.toString() === seller));
      
      totalCount = allFilteredOrders.length;
    } else {
      // Simple count for basic filters
      totalCount = await Order.countDocuments(filter);
    }

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: {
        orders: filteredOrders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        }
      },
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};


// @desc    Get single order by ID
// @route   GET /api/order/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.'
      });
    }

    const order = await Order.findById(id)
      .populate('product', 'name brand productCode brandCode productLink productPlatform')
      .populate('mediator', 'name nickName email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.'
      });
    }

    const updateFields = { ...req.body.data };
    // Handle file uploads for update
    if (req.files?.orderSS?.[0]) {
      updateFields.orderSS = req.files.orderSS[0].path || req.files.orderSS[0].secure_url;
    }
    if (req.files?.priceBreakupSS?.[0]) {
      updateFields.priceBreakupSS = req.files.priceBreakupSS[0].path || req.files.priceBreakupSS[0].secure_url;
    }

    // Create update object with only the fields that are present in req.body

    // Remove id from update fields
    delete updateFields.id;

    // Validate mediator if being updated
    // if (updateFields.mediator) {
    //   const isMediatorExists = await User.findOne({ _id: updateFields.mediator, role: MEDIATOR });
    //   if (!isMediatorExists) {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'Mediator doesnt exists with this id. Please try again.'
    //     });
    //   }
    // }
    // Validate product if being updated
    // if (updateFields.product) {
    //   const isProductExists = await Product.findOne({ _id: updateFields.product });
    //   if (!isProductExists) {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'Product doesnt exists with this id. Please try again.'
    //     });
    //   }
    // }

    // Check for duplicate order number if being updated
    // if (updateFields.orderNumber) {
    //   const existingOrder = await Order.findOne({
    //     orderNumber: updateFields.orderNumber,
    //     _id: { $ne: id }
    //   });
    //   if (existingOrder) {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'Another order already exists with this order number'
    //     });
    //   }
    // }
    // console.log("updatedFields", updateFields);


    // Prepare validation promises conditionally
    const validationPromises = [];

    if (updateFields.mediator) {
      validationPromises.push(
        User.findOne({ _id: updateFields.mediator, role: MEDIATOR })
          .select('_id')
          .lean()
          .then(mediator => {
            if (!mediator) throw new Error('MEDIATOR_NOT_FOUND');
            return null;
          })
      );
    }

    if (updateFields.product) {
      validationPromises.push(
        Product.findOne({ _id: updateFields.product })
          .select('_id')
          .lean()
          .then(product => {
            if (!product) throw new Error('PRODUCT_NOT_FOUND');
            return null;
          })
      );
    }

    if (updateFields.orderNumber) {
      validationPromises.push(
        Order.findOne({
          orderNumber: updateFields.orderNumber,
          _id: { $ne: id }
        })
          .select('_id')
          .lean()
          .then(order => {
            if (order) throw new Error('DUPLICATE_ORDER_NUMBER');
            return null;
          })
      );
    }

    // Run all validations concurrently
    if (validationPromises.length > 0) {
      await Promise.all(validationPromises);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    ).populate('product', 'name brand productCode productCode productPlatform')
      .populate('mediator', 'name nickName email phone');

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order:', error);

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
        message: 'Invalid order ID format'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Order number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating order'
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.'
      });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const deletedRefund = await Refund.findOneAndDelete({order:id});

    if(!deletedRefund){
      res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
        data: {
          _id: deletedOrder._id,
          orderNumber: deletedOrder.orderNumber,
          name: deletedOrder.name
        }
      });
    }else{
      res.status(200).json({
        success: true,
        message: 'Order and refund deleted successfully',
        data: {
          _id: deletedOrder._id,
          orderNumber: deletedOrder.orderNumber,
          name: deletedOrder.name
        }
      });
    }

    

  } catch (error) {
    console.error('Error deleting order:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting order'
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/order/:id
// @access  Private
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, rejectionMessage, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.'
      });
    }

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: 'Order status is required'
      });
    }

    const validStatuses = ['accepted', 'pending', 'rejected', 'payment_done', 'refund_placed' , 'refill'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const updateData = { orderStatus };

    // Add rejection message if status is rejected
    if (orderStatus === 'rejected' && rejectionMessage) {
      updateData.rejectionMessage = rejectionMessage;
    }

    // Add note if provided
    if (note) {
      updateData.note = note;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('product', 'name brand productCode productPlatform ')
      .populate('mediator', 'name nickName email phone');

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus} successfully`,
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
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
      message: 'Server error while updating order status'
    });
  }
};

// @desc    Get orders by mediator
// @route   GET /api/orders/mediator/:mediatorId
// @access  Private
export const getOrdersByMediator = async (req, res) => {
  try {
    const { mediatorId } = req.params;
    const { page = 1, limit = 10, orderStatus } = req.query;

    if (!mongoose.Types.ObjectId.isValid(mediatorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mediator ID format.'
      });
    }

    const filter = { mediator: mediatorId };

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    const orders = await Order.find(filter)
      .populate('product', 'name brand productCode')
      .populate('mediator', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get orders by mediator error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid mediator ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Get orders by product
// @route   GET /api/orders/product/:productId
// @access  Private
export const getOrdersByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, orderStatus } = req.query;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    const filter = { product: productId };

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    const orders = await Order.find(filter)
      .populate('product', 'name brand productCode')
      .populate('mediator', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get orders by product error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};


// @desc    Get all orders for download with filters and search
// @route   GET /api/order/download
// @access  Private/Admin
export const getOrdersforDownload = async (req, res) => {
  try {
    const {
      searchQuery,
      product,
      platform,
      mediator,
      seller,
      status,
      dealType,
      isReplacement,
      ratingOrReview,
      fromDate,
      toDate
    } = req.query;

    // Build filter object
    let filter = {};

    // Search query across multiple fields
    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { orderNumber: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Product filter
    if (product) {
      filter.product = product;
    }

    // Mediator filter
    if (mediator) {
      filter.mediator = mediator;
    }

    // Status filter
    if (status) {
      filter.orderStatus = status;
    }

    // Deal type filter
    if (dealType) {
      filter.dealType = dealType;
    }

    // Replacement filter
    if (isReplacement) {
      filter.isReplacement = isReplacement;
    }

    // Rating/Review filter
    if (ratingOrReview) {
      filter.ratingOrReview = ratingOrReview;
    }

    // Date range filter
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endOfDay;
        // filter.createdAt.$lte = new Date(toDate);
      }
    }

    // Get orders with populated references and apply platform filter
    let ordersQuery = Order.find(filter)
      .populate('product', 'name brand productCode brandCode productPlatform ratingSlots reviewSlots seller')
      .populate('mediator', 'name nickName email phone')
      .sort({ createdAt: -1 });

    // Execute query
    let orders = (await ordersQuery)

    // Apply platform filter after population (since platform is in Product model)
    if (platform) {
      orders = orders.filter(order => order.product &&
        order.product.productPlatform &&
        order.product.productPlatform.toLowerCase() === platform.toLowerCase());
    }

    // Format the response data for export
    const formattedOrders = orders.map(order => {
      if (!seller || seller === order.product.seller.toString()) {
        return {
          orderNumber: order.orderNumber,
          oldOrderNumber: order.oldOrderNumber || '',
          orderDate: order.orderDate.toISOString().split('T')[0],
          orderStatus: order.orderStatus,
          reviewerName: order.name,
          reviewerEmail: order.email,
          reviewerPhone: order.phone,
          productName: order.product?.name || 'N/A',
          productBrand: order.product?.brand || 'N/A',
          productCode: order.product?.productCode || 'N/A',
          brandCode: order.product?.brandCode || 'N/A',
          platform: order.product?.productPlatform || 'N/A',
          mediatorName: order.mediator?.nickName || 'N/A',
          mediatorEmail: order.mediator?.email || 'N/A',
          mediatorPhone: order.mediator?.phone || 'N/A',
          orderAmount: order.orderAmount,
          lessPrice: order.lessPrice,
          dealType: order.dealType,
          exchangeProduct: order.exchangeProduct || '',
          isReplacement: order.isReplacement,
          ratingOrReview: order.ratingOrReview,
          rejectionMessage: order.rejectionMessage || '',
          note: order.note || '',
          orderSS: order.orderSS || '',
          priceBreakupSS: order.priceBreakupSS || '',
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        }
      }
    }).filter(order => order);

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};