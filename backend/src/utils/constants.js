// User Roles
export const ROLES = {
    STUDENT: 'student',
    GUARD: 'guard',
    ADMIN: 'admin',
};

// Item Status
export const ITEM_STATUS = {
    AVAILABLE: 'available',
    CLAIMED: 'claimed',
    DELIVERED: 'delivered',
};

// Claim Status
export const CLAIM_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
};

// Notification Types
export const NOTIFICATION_TYPES = {
    CLAIM_SUBMITTED: 'claim_submitted',
    CLAIM_APPROVED: 'claim_approved',
    CLAIM_REJECTED: 'claim_rejected',
    CLAIM_COMPLETED: 'claim_completed',
    NEW_ITEM: 'new_item',
    VERIFICATION_REMINDER: 'verification_reminder',
    ITEM_DELIVERED: 'item_delivered',
    SYSTEM_ALERT: 'system_alert',
};

// Notification Priorities
export const NOTIFICATION_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
};

// Item Categories
export const ITEM_CATEGORIES = [
    'Electronics',
    'Documents',
    'Accessories',
    'Books',
    'Clothing',
    'Keys',
    'ID Cards',
    'Water Bottle',
    'Other',
];

// Campus Locations
export const CAMPUS_LOCATIONS = [
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
];

// Student Branches
export const STUDENT_BRANCHES = [
    'Computer Science',
    'Information Technology',
    'Electronics & Telecommunication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Production Engineering',
];

// Student Years
export const STUDENT_YEARS = [
    'First Year (FE)',
    'Second Year (SE)',
    'Third Year (TE)',
    'Final Year (BE)',
];

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER: 500,
};

// Success Messages
export const SUCCESS_MESSAGES = {
    REGISTER: 'Registration successful',
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    ITEM_CREATED: 'Item created successfully',
    ITEM_UPDATED: 'Item updated successfully',
    ITEM_DELETED: 'Item deleted successfully',
    CLAIM_CREATED: 'Claim submitted successfully',
    CLAIM_UPDATED: 'Claim updated successfully',
    CLAIM_CANCELLED: 'Claim cancelled successfully',
    NOTIFICATION_READ: 'Notification marked as read',
    ALL_NOTIFICATIONS_READ: 'All notifications marked as read',
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    USER_ACTIVATED: 'User activated successfully',
    SETTINGS_UPDATED: 'Settings updated successfully',
};

// Error Messages
export const ERROR_MESSAGES = {
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_EXISTS: 'User already exists',
    ITEM_NOT_FOUND: 'Item not found',
    CLAIM_NOT_FOUND: 'Claim not found',
    ITEM_NOT_AVAILABLE: 'Item is not available',
    ALREADY_CLAIMED: 'You have already claimed this item',
    INVALID_STATUS: 'Invalid status update',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
};

// Pagination Defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'DD/MM/YYYY',
    DISPLAY_TIME: 'DD/MM/YYYY HH:mm',
    API: 'YYYY-MM-DD',
    API_TIME: 'YYYY-MM-DDTHH:mm:ss',
};

// JWT Constants
export const JWT = {
    EXPIRY: '7d',
    REFRESH_EXPIRY: '30d',
};

// File Upload
export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    MAX_FILES: 5,
};

// Email Subjects
export const EMAIL_SUBJECTS = {
    WELCOME: 'Welcome to SGGS Lost & Found',
    CLAIM_CONFIRMATION: 'Claim Confirmation',
    CLAIM_APPROVED: 'Claim Approved',
    CLAIM_REJECTED: 'Claim Rejected',
    CLAIM_COMPLETED: 'Claim Completed',
    VERIFICATION_REMINDER: 'Verification Reminder',
};

// API Endpoints (for frontend reference)
export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        ME: '/api/auth/me',
    },
    ITEMS: {
        BASE: '/api/items',
        RECENT: '/api/items/recent',
        SEARCH: '/api/items/search',
        USER_ITEMS: '/api/items/user/me',
    },
    CLAIMS: {
        BASE: '/api/claims',
        MY_CLAIMS: '/api/claims/my',
    },
    NOTIFICATIONS: {
        BASE: '/api/notifications',
        UNREAD_COUNT: '/api/notifications/unread-count',
        READ_ALL: '/api/notifications/read-all',
    },
    USERS: {
        BASE: '/api/users',
    },
    ANALYTICS: {
        STATS: '/api/analytics/stats',
        MONTHLY: '/api/analytics/monthly',
        CATEGORIES: '/api/analytics/categories',
        LOCATIONS: '/api/analytics/locations',
    },
    SETTINGS: {
        BASE: '/api/settings',
    },
};