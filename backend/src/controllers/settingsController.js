import Settings from '../models/Settings.js';

// @desc    Get settings
// @route   GET /api/settings
// @access  Private (Admin)
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();

        res.json({
            success: true,
            settings,
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings();
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (key in settings) {
                settings[key] = req.body[key];
            }
        });

        settings.updatedBy = req.user._id;
        await settings.save();

        res.json({
            success: true,
            settings,
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};