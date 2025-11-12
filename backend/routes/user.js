import express from 'express';
import { getUserDashboard } from '../controllers/userController.js';
import { authorize, protect } from '../middlewares/auth.js';
const router= express.Router();


router.get('/dashboard', protect,authorize('user'), getUserDashboard)

export default router;