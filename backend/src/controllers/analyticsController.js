import User from '../models/User.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';

// @desc    Get dashboard statistics
// @route   GET /api/analytics/stats
// @access  Private (Admin)
export const getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalStudents,
            totalGuards,
            totalItems,
            availableItems,
            claimedItems,
            deliveredItems,
            totalClaims,
            pendingClaims,
            approvedClaims,
            rejectedClaims,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'guard' }),
            Item.countDocuments(),
            Item.countDocuments({ status: 'available' }),
            Item.countDocuments({ status: 'claimed' }),
            Item.countDocuments({ status: 'delivered' }),
            Claim.countDocuments(),
            Claim.countDocuments({ status: 'pending' }),
            Claim.countDocuments({ status: 'approved' }),
            Claim.countDocuments({ status: 'rejected' }),
        ]);

        const successRate = totalClaims > 0
            ? Math.round((approvedClaims / totalClaims) * 100)
            : 0;

        res.json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    students: totalStudents,
                    guards: totalGuards,
                    admins: totalUsers - totalStudents - totalGuards,
                },
                items: {
                    total: totalItems,
                    available: availableItems,
                    claimed: claimedItems,
                    delivered: deliveredItems,
                },
                claims: {
                    total: totalClaims,
                    pending: pendingClaims,
                    approved: approvedClaims,
                    rejected: rejectedClaims,
                    successRate,
                },
            },
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get monthly trends
// @route   GET /api/analytics/monthly
// @access  Private (Admin)
export const getMonthlyTrends = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        const itemsByMonth = await Item.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const claimsByMonth = await Claim.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const itemsData = months.map((month, index) => {
            const monthData = itemsByMonth.find(d => d._id === index + 1);
            return {
                month,
                count: monthData ? monthData.count : 0,
            };
        });

        const claimsData = months.map((month, index) => {
            const monthData = claimsByMonth.find(d => d._id === index + 1);
            return {
                month,
                count: monthData ? monthData.count : 0,
            };
        });

        res.json({
            success: true,
            items: itemsData,
            claims: claimsData,
        });
    } catch (error) {
        console.error('Get monthly trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get category distribution
// @route   GET /api/analytics/categories
// @access  Private (Admin)
export const getCategoryDistribution = async (req, res) => {
    try {
        const categories = await Item.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        res.json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get location distribution
// @route   GET /api/analytics/locations
// @access  Private (Admin)
export const getLocationDistribution = async (req, res) => {
    try {
        const locations = await Item.aggregate([
            {
                $group: {
                    _id: '$location',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        res.json({
            success: true,
            locations,
        });
    } catch (error) {
        console.error('Get locations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};