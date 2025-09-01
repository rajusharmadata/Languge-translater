import nodemailer from 'nodemailer';

let transporter;

const initTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to || !to.includes('@')) {
      throw new Error('Invalid recipient email');
    }

    const transporter = initTransporter();

    await transporter.sendMail({
      from: `"TransLingo" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent to', to);
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

export { sendEmail };
