import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Item title is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Electronics',
            'Documents',
            'Accessories',
            'Books',
            'Clothing',
            'Keys',
            'ID Cards',
            'Water Bottle',
            'Other',
        ],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        enum: [
            'Main Building',
            'Library',
            'Canteen',
            'Sports Complex',
            'Hostel',
            'Classroom',
            'Laboratory',
            'Auditorium',
            'Parking',
            'Other',
        ],
    },
    foundDate: {
        type: Date,
        required: [true, 'Found date is required'],
        default: Date.now,
    },
    image: {
        type: String,
        default: null,
    },
    imagePublicId: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['available', 'claimed', 'delivered'],
        default: 'available',
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    claimCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Index for search functionality
itemSchema.index({ title: 'text', description: 'text' });

const Item = mongoose.model('Item', itemSchema);

export default Item;