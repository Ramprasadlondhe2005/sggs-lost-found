import express from 'express';
import { body, param } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
} from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, isAdmin);

router.get('/', getUsers);
router.get('/:id', param('id').isMongoId(), getUserById);
router.post(
    '/',
    [
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
    ],
    createUser
);
router.put('/:id', param('id').isMongoId(), updateUser);
router.delete('/:id', param('id').isMongoId(), deleteUser);
router.put('/:id/activate', param('id').isMongoId(), activateUser);

export default router;