import express from 'express';
import { body, param } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { isStudent, isGuard } from '../middleware/roleCheck.js';
import {
    createClaim,
    getMyClaims,
    getAllClaims,
    getClaimById,
    updateClaimStatus,
    cancelClaim,
} from '../controllers/claimController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student routes
router.post(
    '/',
    isStudent,
    [
        body('itemId').isMongoId().withMessage('Valid item ID required'),
        body('reason').notEmpty().withMessage('Reason is required').trim(),
    ],
    createClaim
);

router.get('/my', isStudent, getMyClaims);

router.delete(
    '/:id',
    isStudent,
    param('id').isMongoId(),
    cancelClaim
);

// Guard/Admin routes
router.get('/', isGuard, getAllClaims);

router.get(
    '/:id',
    param('id').isMongoId(),
    getClaimById
);

router.put(
    '/:id',
    isGuard,
    param('id').isMongoId(),
    updateClaimStatus
);

export default router;