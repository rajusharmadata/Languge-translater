// src/pages/CancellationsRefunds.jsx
import React from 'react';
import PolicyPage from './PolicyPage';

const CancellationsRefunds = () => {
  return (
    <PolicyPage
      title='Cancellations and Refunds'
      content={[
        'Orders can be canceled within 24 hours of purchase.',
        'Refunds will be processed within 5-7 business days after approval.',
        'For damaged or defective products, contact us immediately.',
      ]}
    />
  );
};

export default CancellationsRefunds;
