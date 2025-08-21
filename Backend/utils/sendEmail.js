import nodemailer from 'nodemailer';
import { otpTemplate } from './emailTemplet.js';

const sendEmail = async (to, otp) => {
  try {
    if (!to || !to.includes('@')) {
      throw new Error('Invalid recipient email');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // use 587 if secure=false
      secure: true, // true = TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use app password
      },
    });

    // optional check
    await transporter.verify();

    await transporter.sendMail({
      from: `"TransLingo" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your OTP Code',
      html: otpTemplate(to,otp),
    });

    console.log('✅ Email sent to', to);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
};

export { sendEmail };
