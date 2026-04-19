import nodemailer from 'nodemailer';

// Configure your email service here
// Using Gmail or any other email provider
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS (not SSL)
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password', // Use app-specific password for Gmail
  },
});

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || 'your-email@gmail.com',
      to: email,
      subject: '🔐 TinySteps Email Verification - Your OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7b68ee 0%, #6a5acd 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🎉 TinySteps</h1>
            <p style="color: white; margin: 10px 0 0 0;">Email Verification</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Verify Your Email Address</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hello Parent! 👋
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for signing up with TinySteps. To complete your email verification, please enter the OTP below:
            </p>
            
            <div style="background: #fff; border: 3px dashed #7b68ee; border-radius: 10px; padding: 25px; text-align: center; margin: 25px 0;">
              <h1 style="color: #7b68ee; font-size: 48px; letter-spacing: 5px; margin: 0; font-family: monospace; font-weight: bold;">
                ${otp}
              </h1>
              <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">Valid for 10 minutes</p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              <strong>⚠️ Important:</strong>
            </p>
            <ul style="color: #666; font-size: 14px; line-height: 1.8;">
              <li>Don't share this OTP with anyone</li>
              <li>This OTP is valid for 10 minutes only</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 TinySteps. All rights reserved.<br>
              Making childhood magical, one activity at a time! 🌟
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP Email sent successfully to ${email}`);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error(`❌ Error sending OTP email to ${email}:`, error.message);
    console.error("Full Error Details:", error);
    throw new Error('Failed to send OTP email: ' + error.message);
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || 'your-email@gmail.com',
      to: email,
      subject: '🎉 Welcome to TinySteps!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7b68ee 0%, #6a5acd 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Welcome to TinySteps!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hello ${userName}! 👋
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Welcome to TinySteps - where your child's growth becomes magical! 🌟
            </p>
            
            <div style="background: #fff; border-left: 4px solid #7b68ee; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin: 0 0 10px 0; color: #2c3e50;">What You Can Do Now:</h3>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li>✅ Add your children's profiles</li>
                <li>✅ Create daily activities and tasks</li>
                <li>✅ Track progress with our dashboard</li>
                <li>✅ Celebrate milestones with rewards</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you have any questions, feel free to reach out to our support team!
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 TinySteps. All rights reserved.<br>
              Making childhood magical, one activity at a time! 🌟
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Welcome email sent' };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send welcome email');
  }
};

export default transporter;
