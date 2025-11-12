import express from 'express';
import { authorize, protect } from '../middlewares/auth.js';
import {
  createUser, 
  getAllMediators, 
  getAllSellers,
  toggleSellerStatus,
  toggleMediatorStatus,
  deleteUser,
  updateUserProfile,
  verifyUserAdmin,
  rejectUserAdmin,
  getAdminDashboard,
  getAllFiltersData
} from '../controllers/adminController.js';

const router = express.Router();

// Refund routes


// User management routes
// @desc    Create new mediator user
// @route   POST /api/admin/new-user
// @access  Private/Admin
router.post('/new-user', protect, authorize('admin'), createUser);

// @desc    Get all mediator accounts (simple version)
// @route   GET /api/admin/all-mediators
// @access  Private/Admin
router.get('/all-mediators', protect, authorize('admin'), getAllMediators);

// @desc    Get all seller accounts
// @route   GET /api/admin/all-sellers
// @access  Private/Admin
router.get('/all-sellers', protect, authorize('admin'), getAllSellers);

// @desc    Toggle mediator active status
// @route   PATCH /api/admin/mediator/:id/toggle-status
// @access  Private/Admin
router.patch('/mediator/:id/toggle-status', protect, authorize('admin'), toggleMediatorStatus);

// @desc    Toggle seller active status
// @route   PATCH /api/admin/seller/:id/toggle-status
// @access  Private/Admin
router.patch('/seller/:id/toggle-status', protect, authorize('admin'), toggleSellerStatus);


// @desc   Delete User
// @route   Delete /api/admin/delete-user/:id
// @access  Private/Admin
router.delete('/delete-user/:id', protect, authorize('admin'), deleteUser);


// @desc    Update the user Profile
// @route   PUT /api/admin/update-profile/:id
// @access  Private(admin)
router.put('/update-profile/:id', protect,authorize('admin'),  updateUserProfile);


// @desc    Verify user account with admin
// @route   POST /api/admin/verify-user
// @access  Private
router.post('/verify-user',protect , authorize("admin"), verifyUserAdmin);



// @desc    reject user account with admin
// @route   POST /api/admin/reject-user
// @access  Private
router.post('/reject-user',protect , authorize("admin"), rejectUserAdmin);

router.get('/dashboard', protect,authorize('admin'), getAdminDashboard);


// @desc    Get all filter options for orders
// @route   GET /api/order/filter-options
// @access  Private(admin)
router.get('/filter-options', protect , authorize("admin") , getAllFiltersData);

export default router;