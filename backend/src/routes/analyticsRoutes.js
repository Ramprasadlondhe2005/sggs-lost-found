import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';
import {
    getStats,
    getMonthlyTrends,
    getCategoryDistribution,
    getLocationDistribution,
} from '../controllers/analyticsController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, isAdmin);

router.get('/stats', getStats);
router.get('/monthly', getMonthlyTrends);
router.get('/categories', getCategoryDistribution);
router.get('/locations', getLocationDistribution);

export default router;