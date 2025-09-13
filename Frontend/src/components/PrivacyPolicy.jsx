// src/pages/PrivacyPolicy.jsx
import React from 'react';
import PolicyPage from './PolicyPage';

const PrivacyPolicy = () => {
  return (
    <PolicyPage
      title="Privacy Policy"
      content={[
        'We value your privacy and protect your personal information.',
        'We do not sell or share your data with third parties without consent.',
        'Your payment details are secured with encryption.',
      ]}
    />
  );
};

export default PrivacyPolicy;
