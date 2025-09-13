// src/components/PolicyPage.jsx
import React from 'react';

const PolicyPage = ({ title, content }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>
      <div className="bg-white shadow-md rounded-2xl p-6 text-gray-700 leading-relaxed">
        {content.map((para, index) => (
          <p key={index} className="mb-4">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PolicyPage;
