import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email config error:', error);
    } else {
        console.log('✅ Email server ready');
    }
});

export default transporter;