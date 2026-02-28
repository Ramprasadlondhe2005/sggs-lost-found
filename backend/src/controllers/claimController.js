import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Create claim
// @route   POST /api/claims
// @access  Private (Student only)
export const createClaim = async (req, res) => {
    try {
        const { itemId, reason } = req.body;

        // Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found',
            });
        }

        // Check if item is available
        if (item.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Item is not available for claiming',
            });
        }

        // Check if student already claimed this item
        const existingClaim = await Claim.findOne({
            item: itemId,
            student: req.user._id,
        });

        if (existingClaim) {
            return res.status(400).json({
                success: false,
                message: 'You have already claimed this item',
            });
        }

        // Get student details
        const student = await User.findById(req.user._id);

        // Create claim
        const claim = await Claim.create({
            item: itemId,
            student: req.user._id,
            reason,
            studentDetails: {
                name: student.name,
                email: student.email,
                prn: student.prn,
                branch: student.branch,
                year: student.year,
                phone: student.phone,
            },
        });

        // Update item claim count
        item.claimCount += 1;
        await item.save();

        // Create notification for guards
        const guards = await User.find({ role: 'guard' });
        for (const guard of guards) {
            await Notification.create({
                user: guard._id,
                type: 'claim_submitted',
                title: 'New Claim',
                message: `${student.name} claimed "${item.title}"`,
                data: { claimId: claim._id, itemId: item._id },
                read: false,
            });
        }

        res.status(201).json({
            success: true,
            claim,
        });
    } catch (error) {
        console.error('Create claim error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get user's claims
// @route   GET /api/claims/my
// @access  Private
export const getMyClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ student: req.user._id })
            .populate('item', 'title category location image status')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            claims,
        });
    } catch (error) {
        console.error('Get my claims error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get all claims (Guard/Admin)
// @route   GET /api/claims
// @access  Private (Guard/Admin)
export const getAllClaims = async (req, res) => {
    try {
        const { status } = req.query;
        const query = {};

        if (status) query.status = status;

        const claims = await Claim.find(query)
            .populate('item', 'title category location image')
            .populate('student', 'name email prn branch year phone')
            .populate('verifiedBy', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            claims,
        });
    } catch (error) {
        console.error('Get all claims error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get claim by ID
// @route   GET /api/claims/:id
// @access  Private
export const getClaimById = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id)
            .populate('item')
            .populate('student', 'name email prn branch year phone')
            .populate('verifiedBy', 'name');

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found',
            });
        }

        // Check permission
        if (req.user.role === 'student' && claim.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        res.json({
            success: true,
            claim,
        });
    } catch (error) {
        console.error('Get claim error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Update claim status
// @route   PUT /api/claims/:id
// @access  Private (Guard/Admin)
export const updateClaimStatus = async (req, res) => {
    try {
        const { status, verificationDate, verificationTime, verificationLocation, rejectionReason } = req.body;

        const claim = await Claim.findById(req.params.id)
            .populate('item')
            .populate('student');

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found',
            });
        }

        // Update claim
        claim.status = status;
        claim.verifiedBy = req.user._id;

        if (status === 'approved') {
            claim.verificationDate = verificationDate;
            claim.verificationTime = verificationTime;
            claim.verificationLocation = verificationLocation;

            // Update item status
            await Item.findByIdAndUpdate(claim.item._id, { status: 'claimed' });
        }

        if (status === 'rejected') {
            claim.rejectionReason = rejectionReason;
        }

        if (status === 'completed') {
            claim.deliveredDate = Date.now();

            // Update item status
            await Item.findByIdAndUpdate(claim.item._id, { status: 'delivered' });
        }

        await claim.save();

        // Create notification for student
        let notificationMessage = '';
        switch (status) {
            case 'approved':
                notificationMessage = `Your claim for "${claim.item.title}" has been approved. Verification scheduled on ${verificationDate} at ${verificationTime}`;
                break;
            case 'rejected':
                notificationMessage = `Your claim for "${claim.item.title}" has been rejected. Reason: ${rejectionReason}`;
                break;
            case 'completed':
                notificationMessage = `Item "${claim.item.title}" has been delivered. Thank you!`;
                break;
        }

        await Notification.create({
            user: claim.student._id,
            type: `claim_${status}`,
            title: `Claim ${status}`,
            message: notificationMessage,
            data: { claimId: claim._id, itemId: claim.item._id },
            read: false,
        });

        res.json({
            success: true,
            claim,
        });
    } catch (error) {
        console.error('Update claim error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Cancel claim (Student only)
// @route   DELETE /api/claims/:id
// @access  Private (Student)
export const cancelClaim = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found',
            });
        }

        // Check ownership
        if (claim.student.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this claim',
            });
        }

        // Only pending claims can be cancelled
        if (claim.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending claims can be cancelled',
            });
        }

        await claim.deleteOne();

        res.json({
            success: true,
            message: 'Claim cancelled successfully',
        });
    } catch (error) {
        console.error('Cancel claim error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};