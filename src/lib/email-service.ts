// Email service - sends emails via your provider
// Using Nodemailer for now - you can replace with SendGrid, Mailgun, etc.

import nodemailer from "nodemailer";

// Configure your email provider
// For production, use environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using configured transporter
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const mailOptions = {
      from: options.from || process.env.EMAIL_FROM || "noreply@healthyflow.com",
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent: ${info.response}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    // In production, you might want to handle this differently
    // e.g., queue for retry, log to service, etc.
    return false;
  }
};

/**
 * Verify email configuration (call this on app startup)
 */
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log("✅ Email service is ready");
    return true;
  } catch (error) {
    console.error("❌ Email service configuration error:", error);
    return false;
  }
};
