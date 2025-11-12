import Order from '../models/Order.js';
import Refund from '../models/Refund.js';

// @desc    Track order and refund status
// @route   GET /api/track/:orderNumber
// @access  Public
export const trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    // Find order
    const order = await Order.findOne({ orderNumber: orderNumber.toUpperCase() })
    .populate('mediator','name email phone')
    .populate('product', 'productPlatform productSlots productLink brandCode productCode brand name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Find associated refund if exists
    const refund = await Refund.findOne({ order:order._id });

    const timeLine = {
        orderSubmitted: order?true:false,
        refundSubmitted: refund?true:false,
        status: refund?.status
    }

    // Prepare response data
    const trackingData = {
        product:order.product,
        mediator:order.mediator,
        orderAmount:order.orderAmount,
        lessPrice:order.lessPrice,
        orderPlacedOn:order.orderDate,
        createdAt:order.createdAt,
        orderNumber:order.orderNumber,
        status:order.status,
        name:order.name,
        phone:order.phone,
        email:order.email,
        lastUpdated:order.updatedAt,
        timeLine,
        upiId:refund?.upiId,
        bankInfo: refund?.bankInfo,
    };

    res.status(200).json({
      success: true,
      data: trackingData
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while tracking order'
    });
  }
};
