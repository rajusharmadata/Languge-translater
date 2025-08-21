// utils/emailTemplates.js

export const otpTemplate = (email, otp) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">

    <!-- Header -->
    <div style="text-align: center; padding-bottom: 10px; border-bottom: 1px solid #eee;">
      <h2 style="color: #003366; margin: 0;">🌍 TransLingo</h2>
      <p style="color: #888; font-size: 14px; margin: 5px 0 0;">Breaking Language Barriers</p>
    </div>

    <!-- Greeting -->
    <p style="font-size: 15px; color: #333; margin-top: 20px; text-align: center;">
      Hello <b>${email || 'Explorer'}</b>,
    </p>
    <p style="font-size: 15px; color: #444; text-align: center;">
      Use the OTP below to securely verify your account:
    </p>

    <!-- OTP Card -->
    <div style="text-align: center; margin: 25px 0;">
      <div style="display: inline-block; background: #f0f6ff; padding: 15px 30px; border-radius: 8px; border: 1px solid #cce0ff;">
        <span style="font-size: 30px; font-weight: bold; color: #003366; letter-spacing: 6px;">
          ${otp}
        </span>
      </div>
    </div>

    <!-- Instructions -->
    <p style="font-size: 13px; color: #666; text-align: center;">
      ⏳ This OTP is valid for <b>05 minutes</b>. Please do not share it with anyone.
    </p>

    <!-- Footer -->
    <div style="border-top: 1px solid #eee; margin-top: 25px; padding-top: 15px; text-align: center;">
      <p style="font-size: 12px; color: #999; margin: 0;">
        Need help? Contact <a href="mailto:support@translingo.com" style="color: #003366; text-decoration: none;">support@translingo.com</a>
      </p>
      <p style="font-size: 12px; color: #aaa; margin: 5px 0 0;">
        &copy; ${new Date().getFullYear()} TransLingo. All rights reserved.
      </p>
    </div>
  </div>
  `;
};
