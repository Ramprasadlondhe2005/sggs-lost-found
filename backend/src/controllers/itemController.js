import Item from '../models/Item.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all items with filters
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
    try {
        const { category, location, status, search, page = 1, limit = 20 } = req.query;

        const query = {};

        if (category) query.category = category;
        if (location) query.location = location;
        if (status) query.status = status;

        if (search) {
            query.$text = { $search: search };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const items = await Item.find(query)
            .populate('reportedBy', 'name role')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Item.countDocuments(query);

        res.json({
            success: true,
            count: items.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            items,
        });
    } catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('reportedBy', 'name role');

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found',
            });
        }

        res.json({
            success: true,
            item,
        });
    } catch (error) {
        console.error('Get item error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Item not found',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private (Guard/Admin)
export const createItem = async (req, res) => {
    try {
        const { title, category, description, location, foundDate } = req.body;

        // Handle image upload
        let imageUrl = null;
        let imagePublicId = null;

        if (req.file) {
            imageUrl = req.file.path;
            imagePublicId = req.file.filename;
        }

        const item = await Item.create({
            title,
            category,
            description,
            location,
            foundDate: foundDate || Date.now(),
            image: imageUrl,
            imagePublicId,
            reportedBy: req.user._id,
            status: 'available',
        });

        res.status(201).json({
            success: true,
            item,
        });
    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (Guard/Admin)
export const updateItem = async (req, res) => {
    try {
        let item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found',
            });
        }

        // Check permission
        if (req.user.role !== 'admin' && item.reportedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this item',
            });
        }

        // Handle new image
        if (req.file) {
            // Delete old image from cloudinary
            if (item.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(item.imagePublicId);
                } catch (cloudinaryError) {
                    console.error('Cloudinary delete error:', cloudinaryError);
                }
            }

            req.body.image = req.file.path;
            req.body.imagePublicId = req.file.filename;
        }

        item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            item,
        });
    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (Guard/Admin)
export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found',
            });
        }

        // Check permission
        if (req.user.role !== 'admin' && item.reportedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this item',
            });
        }

        // Delete image from cloudinary
        if (item.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(item.imagePublicId);
            } catch (cloudinaryError) {
                console.error('Cloudinary delete error:', cloudinaryError);
            }
        }

        await item.deleteOne();

        res.json({
            success: true,
            message: 'Item deleted successfully',
        });
    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get recent items
// @route   GET /api/items/recent
// @access  Public
export const getRecentItems = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        const items = await Item.find({ status: 'available' })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('reportedBy', 'name');

        res.json({
            success: true,
            items,
        });
    } catch (error) {
        console.error('Get recent items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get items by user (guard's items)
// @route   GET /api/items/user/me
// @access  Private
export const getMyItems = async (req, res) => {
    try {
        const items = await Item.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });

        res.json({
            success: true,
            items,
        });
    } catch (error) {
        console.error('Get my items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Search items
// @route   GET /api/items/search
// @access  Public
export const searchItems = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query required',
            });
        }

        const items = await Item.find(
            { $text: { $search: q } },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(20);

        res.json({
            success: true,
            items,
        });
    } catch (error) {
        console.error('Search items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};