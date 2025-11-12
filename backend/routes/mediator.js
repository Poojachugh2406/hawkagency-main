import express from 'express';
import { getActiveMediators, getMediatorDashboard } from '../controllers/mediatorController.js';
import { authorize, protect } from '../middlewares/auth.js';
const router= express.Router();

router.get('/active-mediators', getActiveMediators);
router.get('/dashboard', protect, authorize("mediator") , getMediatorDashboard);

export default router;