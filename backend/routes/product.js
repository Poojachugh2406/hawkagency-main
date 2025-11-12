import { createProduct, deleteProduct, getActiveProducts, getAllProducts, getProductById, getSlots, toggleProductStatus, updateProduct } from "../controllers/productController.js";
import { authorize, protect } from "../middlewares/auth.js";
import express from 'express';
const router = express.Router();

// Product management routes
// @desc    Create a new product
// @route   POST /api/product/new
// @access  Private/admin
router.post('/new', protect, authorize('admin'), createProduct);

// @desc    Get all products with seller details
// @route   GET /api/product/all-products
// @access  private/admin
router.get('/all-products', protect, authorize('admin'), getAllProducts);

// @desc    Get all products with seller details
// @route   GET /api/product/active-products
// @access  private/admin
router.get('/active-products', getActiveProducts);

// @desc    Get single product by ID
// @route   GET /api/product/:id
// @access  Private/admin
router.get('/:id', protect, authorize('admin'), getProductById);


// @desc    Get slots for product by ID
// @route   GET /api/slots/:id
// @access  Public
router.get('/slots/:id', getSlots);

// @desc    Update product
// @route   PUT /api/product/update-product/:id
// @access  Private/admin
router.put('/update-product/:id', protect, authorize('admin'), updateProduct);

// @desc    Delete product
// @route   DELETE /api/product/delete/:id
// @access  Private/admin
router.delete('/delete-product/:id', protect, authorize('admin'), deleteProduct);

// @desc    Toggle product active status
// @route   PATCH /api/product/:id/toggle-status
// @access  Private/admin
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleProductStatus);


export default router;