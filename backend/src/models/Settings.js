import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'SGGS Lost & Found',
    },
    contactEmail: {
        type: String,
        default: 'support@sggs.ac.in',
    },
    contactPhone: {
        type: String,
        default: '+91 2462 229330',
    },
    address: {
        type: String,
        default: 'SGGS Institute, Vishnupuri, Nanded, Maharashtra 431606',
    },
    verificationHours: {
        type: String,
        default: '9:00 AM - 5:00 PM (Monday to Friday)',
    },
    autoExpiryDays: {
        type: Number,
        default: 30,
    },
    maxClaimAttempts: {
        type: Number,
        default: 3,
    },
    emailNotifications: {
        type: Boolean,
        default: true,
    },
    smsNotifications: {
        type: Boolean,
        default: false,
    },
    maintenanceMode: {
        type: Boolean,
        default: false,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (settings) return settings;
    return await this.create({});
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;