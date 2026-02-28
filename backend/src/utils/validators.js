import { body, param, query, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

// User validation rules
export const userValidation = {
    register: [
        body('name')
            .notEmpty().withMessage('Name is required')
            .trim()
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail()
            .toLowerCase(),

        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

        body('role')
            .optional()
            .isIn(['student', 'guard', 'admin']).withMessage('Invalid role'),

        body('prn')
            .optional()
            .matches(/^\d{4}(CS|IT|EC|EE|ME|CE|PR)\d{3}$/i)
            .withMessage('Invalid PRN format (e.g., 2021CS123)'),

        body('phone')
            .optional()
            .matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
    ],

    login: [
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email'),

        body('password')
            .notEmpty().withMessage('Password is required'),
    ],

    updateProfile: [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

        body('phone')
            .optional()
            .matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
    ],
};

// Item validation rules
export const itemValidation = {
    create: [
        body('title')
            .notEmpty().withMessage('Title is required')
            .trim()
            .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),

        body('category')
            .notEmpty().withMessage('Category is required')
            .isIn([
                'Electronics', 'Documents', 'Accessories', 'Books',
                'Clothing', 'Keys', 'ID Cards', 'Water Bottle', 'Other'
            ]).withMessage('Invalid category'),

        body('location')
            .notEmpty().withMessage('Location is required')
            .isIn([
                'Main Building', 'Library', 'Canteen', 'Sports Complex',
                'Hostel', 'Classroom', 'Laboratory', 'Auditorium', 'Parking', 'Other'
            ]).withMessage('Invalid location'),

        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

        body('foundDate')
            .optional()
            .isISO8601().withMessage('Invalid date format'),
    ],

    update: [
        body('title')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),

        body('status')
            .optional()
            .isIn(['available', 'claimed', 'delivered']).withMessage('Invalid status'),
    ],
};

// Claim validation rules
export const claimValidation = {
    create: [
        body('itemId')
            .notEmpty().withMessage('Item ID is required')
            .isMongoId().withMessage('Invalid item ID format'),

        body('reason')
            .notEmpty().withMessage('Reason is required')
            .trim()
            .isLength({ min: 10, max: 500 }).withMessage('Reason must be between 10 and 500 characters'),
    ],

    updateStatus: [
        body('status')
            .notEmpty().withMessage('Status is required')
            .isIn(['pending', 'approved', 'rejected', 'completed']).withMessage('Invalid status'),

        body('verificationDate')
            .optional()
            .isISO8601().withMessage('Invalid date format'),

        body('verificationTime')
            .optional()
            .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](\s?(AM|PM))?$/i)
            .withMessage('Invalid time format'),
    ],
};

// ID param validator
export const validateId = [
    param('id')
        .isMongoId().withMessage('Invalid ID format'),
];

// Pagination validator
export const paginationValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// Email validator
export const isValidEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

// PRN validator (SGGS format)
export const isValidPRN = (prn) => {
    const re = /^\d{4}(CS|IT|EC|EE|ME|CE|PR)\d{3}$/i;
    return re.test(prn);
};

// Phone validator
export const isValidPhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
};

// Password strength checker
export const checkPasswordStrength = (password) => {
    const errors = [];

    if (password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};