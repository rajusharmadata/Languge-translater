// src/pages/ContactUs.jsx
import React from 'react';
import PolicyPage from './PolicyPage';

const ContactUs = () => {
  return (
    <PolicyPage
      title="Contact Us"
      content={[
        'If you have any questions, feedback, or need support, feel free to contact us.',
        '📧 Email: support@example.com',
        '📞 Phone: +91 9876543210',
        '📍 Address: 123, Main Street, City, State - 000000',
      ]}
    />
  );
};

export default ContactUs;
