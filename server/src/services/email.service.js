const nodemailer = require("nodemailer");
const { logger } = require("../utils/logger");

// Create transporter (configure based on your email provider)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

class EmailService {
  /**
   * Send bill generated notification
   */
  static async sendBillNotification(email, userName, billAmount, billMonth) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your Hostel Bill for ${billMonth}`,
        html: `
          <h2>Bill Generated</h2>
          <p>Dear ${userName},</p>
          <p>Your hostel bill for <strong>${billMonth}</strong> has been generated.</p>
          <p><strong>Amount Due: ৳${billAmount}</strong></p>
          <p>Please log in to your account to view the detailed breakdown and make payment.</p>
          <p>Thank you!</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      logger.info({ email, billMonth }, "Bill notification sent");
    } catch (error) {
      logger.error({ error: error.message, email }, "Failed to send bill notification");
    }
  }

  /**
   * Send complaint status update notification
   */
  static async sendComplaintStatusUpdate(email, userName, complaintId, status, adminNote) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Complaint Status Update - #${complaintId}`,
        html: `
          <h2>Complaint Status Update</h2>
          <p>Dear ${userName},</p>
          <p>Your complaint <strong>#${complaintId}</strong> status has been updated to <strong>${status}</strong>.</p>
          ${adminNote ? `<p><strong>Admin Note:</strong> ${adminNote}</p>` : ""}
          <p>Please log in to your account for more details.</p>
          <p>Thank you!</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      logger.info({ email, complaintId, status }, "Complaint status notification sent");
    } catch (error) {
      logger.error({ error: error.message, email }, "Failed to send complaint notification");
    }
  }

  /**
   * Send attendance reminder
   */
  static async sendAttendanceReminder(email, userName, mealType, date) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Attendance Reminder - ${mealType}`,
        html: `
          <h2>Attendance Reminder</h2>
          <p>Dear ${userName},</p>
          <p>This is a reminder to mark your attendance for <strong>${mealType}</strong> on <strong>${date}</strong>.</p>
          <p>Please log in to your account to mark your attendance.</p>
          <p>Thank you!</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      logger.info({ email, mealType, date }, "Attendance reminder sent");
    } catch (error) {
      logger.error({ error: error.message, email }, "Failed to send attendance reminder");
    }
  }

  /**
   * Send notice announcement
   */
  static async sendNoticeAnnouncement(email, userName, noticeTitle, noticeContent) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `New Notice: ${noticeTitle}`,
        html: `
          <h2>${noticeTitle}</h2>
          <p>Dear ${userName},</p>
          <p>${noticeContent}</p>
          <p>Please log in to your account for more details.</p>
          <p>Thank you!</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      logger.info({ email, noticeTitle }, "Notice announcement sent");
    } catch (error) {
      logger.error({ error: error.message, email }, "Failed to send notice");
    }
  }

  /**
   * Send payment confirmation
   */
  static async sendPaymentConfirmation(email, userName, amount, transactionId, date) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Payment Confirmation - ৳${amount}`,
        html: `
          <h2>Payment Confirmation</h2>
          <p>Dear ${userName},</p>
          <p>Your payment has been successfully processed.</p>
          <p><strong>Amount:</strong> ৳${amount}</p>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p>Thank you for your payment!</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      logger.info({ email, transactionId }, "Payment confirmation sent");
    } catch (error) {
      logger.error({ error: error.message, email }, "Failed to send payment confirmation");
    }
  }

  /**
   * Send bulk email
   */
  static async sendBulkEmail(recipients, subject, htmlContent) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients.join(","),
        subject,
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      logger.info({ recipientCount: recipients.length }, "Bulk email sent");
    } catch (error) {
      logger.error({ error: error.message }, "Failed to send bulk email");
    }
  }
}

module.exports = EmailService;
