import express from 'express';
import { orderLimiter } from '../middlewares/rateLimiter.js';
import { validateOrder } from '../middlewares/validation.js';
import { 
  createOrder, 
  updateOrder, 
  getAllOrders, 
  getOrderById, 
  deleteOrder, 
  updateOrderStatus, 
  getOrdersByMediator, 
  getOrdersByProduct, 
  getMediatorOrders,
  getUserOrders,
  getOrdersforDownload,
  getSellerOrders
} from '../controllers/orderController.js';
import { authorize, protect } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';
import { parseData } from '../middlewares/parseData.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/order/create-order
router.post('/create-order', 
  upload.fields([
    { name: 'orderSS', maxCount: 1 },
    { name: 'priceBreakupSS', maxCount: 1 }
  ]),
  orderLimiter,
  parseData,
  validateOrder,
  createOrder
);

// @desc    Get all orders with filtering and pagination
// @route   GET /api/order/all-orders
router.get('/all-orders', 
  protect, 
  authorize('admin'), 
  getAllOrders
);

router.get('/mediator/all-orders',
  protect,
  authorize('mediator'),
  getMediatorOrders
)

router.get('/seller/all-orders',
  protect,
  authorize('seller'),
  getSellerOrders
)
router.get('/user/all-orders',
  protect,
  authorize('user' , 'mediator' , 'admin' , 'seller'),
  getUserOrders
)


// @desc    Get orders by product
// @route   GET /api/order/download
router.get('/download',
  protect, 
  authorize('admin', 'mediator' , 'seller'), 
  getOrdersforDownload
);


// @desc    Get single order by ID
// @route   GET /api/order/:id
router.get('/:id', 
  protect, 
  authorize('admin', 'mediator', 'user' , 'seller'), 
  getOrderById
);

// @desc    Update order status
// @route   PATCH /api/order/update-status/:id
router.patch('/update-status/:id', 
  protect, 
  authorize('admin', 'mediator'),
  updateOrderStatus
);

// @desc    Delete order
// @route   DELETE /api/order/:id
router.delete('/:id', 
  protect, 
  authorize('admin'), 
  deleteOrder
);

// @desc    Get orders by mediator
// @route   GET /api/orders/mediator/:mediatorId
router.get('/mediator/:mediatorId', 
  protect, 
  authorize('admin', 'mediator'), 
  getOrdersByMediator
);

// @desc    Get orders by product
// @route   GET /api/orders/product/:productId
router.get('/product/:productId', 
  protect, 
  authorize('admin', 'mediator'), 
  getOrdersByProduct
);






// @desc    Update order (legacy route - kept for backward compatibility)
// @route   PUT /api/orders/update-order
router.post('/update-order/:id', 
  protect, 
  authorize('admin', 'mediator','user' , 'seller'),
  upload.fields([
    { name: 'orderSS', maxCount: 1 },
    { name: 'priceBreakupSS', maxCount: 1 }
  ]),
  parseData,
  updateOrder
);

export default router;