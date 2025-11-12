import express from 'express';
import { validateLogin, validateRegister } from '../middlewares/validation.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { changePassword, forgotPassword, getMe, login, register, resendVerification, resetPassword, updateUserProfile, verifyUser } from '../controllers/authController.js';
import {  protect } from '../middlewares/auth.js';
const router= express.Router();

// Public routes

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authLimiter, validateLogin , login);

// @desc Register User
// @route GET /api/auth/register
// @type Public
router.post('/register',authLimiter , validateRegister , register);

// @desc    Verify user account with OTP
// @route   POST /api/auth/verify
// @access  Public
router.post('/verify', verifyUser);


// @desc    Resend verification OTP
// @route   POST /api/auth/resend-verification
// @access  Public
router.post('/resend-verification', resendVerification);

// @desc    Send password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', forgotPassword);

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', resetPassword);

// Protected routes

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getMe);


// @desc    Update the user Profile
// @route   PUT /api/auth/update-profile
// @access  Private
router.put('/update-profile', protect, updateUserProfile);

// @desc    Change password (for authenticated users)
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, changePassword);





export default router;