import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';
import {
    getSettings,
    updateSettings,
} from '../controllers/settingsController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, isAdmin);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;