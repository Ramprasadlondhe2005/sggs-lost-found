import express from 'express';
import { param } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', param('id').isMongoId(), markAsRead);
router.delete('/:id', param('id').isMongoId(), deleteNotification);

export default router;