// src/pages/ShippingPolicy.jsx
import React from 'react';
import PolicyPage from './PolicyPage';

const ShippingPolicy = () => {
  return (
    <PolicyPage
      title="Shipping Policy"
      content={[
        'We aim to deliver products within 7-10 business days.',
        'Shipping charges may vary based on location.',
        'Customers will receive a tracking link via email/SMS once the order is shipped.',
      ]}
    />
  );
};

export default ShippingPolicy;
