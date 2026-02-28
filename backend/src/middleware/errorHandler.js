import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';

// Custom error class
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Not found error handler
export const notFound = (req, res, next) => {
    const error = new AppError(
        `Route not found - ${req.originalUrl}`,
        HTTP_STATUS.NOT_FOUND
    );
    next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error('❌ Error:', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode || HTTP_STATUS.INTERNAL_SERVER,
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new AppError(message, HTTP_STATUS.NOT_FOUND);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const message = `Duplicate field value: ${field}. Please use another value.`;
        error = new AppError(message, HTTP_STATUS.CONFLICT);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        const message = `Validation Error: ${messages.join('. ')}`;
        error = new AppError(message, HTTP_STATUS.BAD_REQUEST);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again.';
        error = new AppError(message, HTTP_STATUS.UNAUTHORIZED);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Your token has expired. Please log in again.';
        error = new AppError(message, HTTP_STATUS.UNAUTHORIZED);
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        const message = 'File too large. Max size is 5MB.';
        error = new AppError(message, HTTP_STATUS.BAD_REQUEST);
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        const message = 'Too many files. Max files is 5.';
        error = new AppError(message, HTTP_STATUS.BAD_REQUEST);
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        const message = 'Unexpected file field.';
        error = new AppError(message, HTTP_STATUS.BAD_REQUEST);
    }

    // Cloudinary errors
    if (err.name === 'CloudinaryError') {
        const message = 'Image upload failed. Please try again.';
        error = new AppError(message, HTTP_STATUS.INTERNAL_SERVER);
    }

    // Send response
    res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER).json({
        success: false,
        message: error.message || ERROR_MESSAGES.SERVER_ERROR,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

// Async handler wrapper to avoid try-catch blocks
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Specific error handlers
export const handleValidationError = (res, errors) => {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.VALIDATION_ERROR,
        errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg,
        })),
    });
};

export const handleNotFound = (res, resource = 'Resource') => {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: `${resource} not found`,
    });
};

export const handleUnauthorized = (res, message = ERROR_MESSAGES.UNAUTHORIZED) => {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message,
    });
};

export const handleForbidden = (res, message = ERROR_MESSAGES.FORBIDDEN) => {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message,
    });
};

export const handleConflict = (res, message) => {
    return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message,
    });
};

export const handleServerError = (res, error, message = ERROR_MESSAGES.SERVER_ERROR) => {
    console.error('Server Error:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
};