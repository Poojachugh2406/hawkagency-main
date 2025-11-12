import express from 'express';
import { getSellerDashboard } from '../controllers/sellerController.js';
import { authorize, protect } from '../middlewares/auth.js';
const router= express.Router();

router.get('/dashboard', protect , authorize("seller") , getSellerDashboard)
export default router;



