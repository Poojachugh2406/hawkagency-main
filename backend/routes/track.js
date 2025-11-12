
import express from 'express';
import { generalLimiter } from '../middlewares/rateLimiter.js';
import { trackOrder } from '../controllers/trackController.js';
const router = express.Router();
// Public routes

// @desc    Track order and refund status
// @route   GET /api/track/:orderNumber
// @access  Public
router.get('/:orderNumber', generalLimiter, trackOrder);
export default router;