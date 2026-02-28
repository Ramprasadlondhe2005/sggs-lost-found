import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: [true, 'Item reference is required'],
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student reference is required'],
    },
    reason: {
        type: String,
        required: [true, 'Reason for claim is required'],
        trim: true,
        maxlength: [500, 'Reason cannot be more than 500 characters'],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending',
    },
    // Verification details
    verificationDate: {
        type: Date,
    },
    verificationTime: {
        type: String,
    },
    verificationLocation: {
        type: String,
    },
    rejectionReason: {
        type: String,
    },
    deliveredDate: {
        type: Date,
    },
    // Student details snapshot (to preserve history)
    studentDetails: {
        name: String,
        email: String,
        prn: String,
        branch: String,
        year: String,
        phone: String,
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

// Ensure one student can't claim same item twice
claimSchema.index({ item: 1, student: 1 }, { unique: true });

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;