import { sendEmail } from './sendEmail.js';

export const forgotPasswordMail = (to, resetUrl) => `
  <div style="font-family: Arial; padding:20px;">
    <h2>Password Reset Request</h2>
    <p>Hello,${to}</p>
    <p>You requested to reset your password. Click below link to reset:</p>
    <a href="${resetUrl}" style="background:#007BFF;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
      Reset Password
    </a>
    <p>If you didn’t request this, please ignore this email.</p>
  </div>
`;

const sendForgotPasswordEmail = async (to, resetUrl) => {
   console.log('to',to);
  return sendEmail({
    to,
    subject: 'Reset Your Password - TransLingo',
    html: forgotPasswordMail(to, resetUrl),
  });
};

export {sendForgotPasswordEmail}
