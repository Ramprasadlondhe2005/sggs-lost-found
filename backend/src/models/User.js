import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'guard', 'admin'],
        default: 'student'
    },
    // Student specific fields
    prn: {
        type: String,
        unique: true,
        sparse: true,
        match: [/^\d{4}(CS|IT|EC|EE|ME|CE|PR)\d{3}$/i, 'Invalid PRN format']
    },
    branch: {
        type: String,
        enum: [
            'Computer Science',
            'Information Technology',
            'Electronics & Telecommunication',
            'Electrical Engineering',
            'Mechanical Engineering',
            'Civil Engineering',
            'Production Engineering'
        ]
    },
    year: {
        type: String,
        enum: ['First Year (FE)', 'Second Year (SE)', 'Third Year (TE)', 'Final Year (BE)']
    },
    // Guard specific fields
    employeeId: {
        type: String,
        unique: true,
        sparse: true
    },
    // Common fields
    phone: {
        type: String,
        match: [/^\d{10}$/, 'Phone number must be 10 digits']
    },
    avatar: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;