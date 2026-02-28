import transporter from '../config/email.js';

export const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `"SGGS Lost & Found" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email send error:', error);
        return { success: false, error: error.message };
    }
};

// Welcome email template
export const sendWelcomeEmail = async (email, name) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to SGGS Lost & Found!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering with SGGS Lost & Found system. You can now:</p>
      <ul>
        <li>Browse lost items on campus</li>
        <li>Claim items that belong to you</li>
        <li>Report items you've found</li>
        <li>Track your claims status</li>
      </ul>
      <p>If you have any questions, please contact the security office.</p>
      <br>
      <p>Best regards,<br>SGGS Lost & Found Team</p>
    </div>
  `;

    return sendEmail({
        to: email,
        subject: 'Welcome to SGGS Lost & Found',
        html,
    });
};

// Claim confirmation email
export const sendClaimConfirmationEmail = async (email, name, itemName, claimId) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Claim Submitted Successfully!</h2>
      <p>Hello ${name},</p>
      <p>Your claim for <strong>"${itemName}"</strong> has been recorded in our system.</p>
      <p><strong>Claim ID:</strong> ${claimId}</p>
      <h3>Next Steps:</h3>
      <ul>
        <li>Security guard will review your claim</li>
        <li>You'll receive email notification when approved/rejected</li>
        <li>If approved, verification details will be shared</li>
      </ul>
      <p>Thank you for using SGGS Lost & Found!</p>
    </div>
  `;

    return sendEmail({
        to: email,
        subject: `Claim Confirmation: ${itemName}`,
        html,
    });
};

// Claim status update email
export const sendClaimStatusEmail = async (email, name, itemName, status, details = {}) => {
    let statusColor, statusMessage, additionalInfo = '';

    switch (status) {
        case 'approved':
            statusColor = '#10b981';
            statusMessage = 'Approved ✅';
            additionalInfo = `
        <p><strong>Verification Date:</strong> ${details.date}</p>
        <p><strong>Verification Time:</strong> ${details.time}</p>
        <p><strong>Location:</strong> ${details.location}</p>
      `;
            break;
        case 'rejected':
            statusColor = '#ef4444';
            statusMessage = 'Rejected ❌';
            additionalInfo = `<p><strong>Reason:</strong> ${details.reason}</p>`;
            break;
        case 'completed':
            statusColor = '#10b981';
            statusMessage = 'Completed ✓';
            additionalInfo = `<p>Item has been successfully delivered.</p>`;
            break;
        default:
            statusColor = '#f59e0b';
            statusMessage = status;
    }

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${statusColor};">Claim ${statusMessage}</h2>
      <p>Hello ${name},</p>
      <p>Your claim for <strong>"${itemName}"</strong> has been <strong>${status}</strong>.</p>
      ${additionalInfo}
      <p>Thank you for using SGGS Lost & Found!</p>
    </div>
  `;

    return sendEmail({
        to: email,
        subject: `Claim ${status}: ${itemName}`,
        html,
    });
};

// Verification reminder email
export const sendVerificationReminderEmail = async (email, name, itemName, date, time, location) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Verification Reminder ⏰</h2>
      <p>Hello ${name},</p>
      <p>This is a reminder that your verification for <strong>"${itemName}"</strong> is scheduled for:</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p>Please bring your college ID card.</p>
      <p>Thank you for using SGGS Lost & Found!</p>
    </div>
  `;

    return sendEmail({
        to: email,
        subject: `Reminder: Verification for ${itemName}`,
        html,
    });
};