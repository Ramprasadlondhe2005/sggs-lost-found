import { upload } from '../config/cloudinary.js';

// Single file upload
export const uploadSingle = upload.single('image');

// Multiple files upload (if needed)
export const uploadMultiple = upload.array('images', 5);

// Error handler for multer
export const handleUploadError = (err, req, res, next) => {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Max size is 5MB.',
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
};