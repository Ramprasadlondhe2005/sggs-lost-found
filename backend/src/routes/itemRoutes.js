import express from 'express';
import { param } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { isGuard } from '../middleware/roleCheck.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';
import {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getRecentItems,
    getMyItems,
    searchItems,
} from '../controllers/itemController.js';

const router = express.Router();

// Public routes
router.get('/', getItems);
router.get('/recent', getRecentItems);
router.get('/search', searchItems);
router.get('/:id', param('id').isMongoId(), getItemById);

// Protected routes (require authentication)
router.use(protect);

// Authenticated users can create items
router.post(
    '/',
    uploadSingle,
    handleUploadError,
    createItem
);

router.get('/user/me', getMyItems);

router.put(
    '/:id',
    isGuard,
    param('id').isMongoId(),
    uploadSingle,
    handleUploadError,
    updateItem
);

router.delete(
    '/:id',
    isGuard,
    param('id').isMongoId(),
    deleteItem
);

export default router;