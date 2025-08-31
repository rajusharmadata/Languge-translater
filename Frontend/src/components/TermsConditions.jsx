// src/pages/TermsConditions.jsx
import React from "react";
import PolicyPage from "./PolicyPage";

const TermsConditions = () => {
  return (
    <PolicyPage
      title="Terms and Conditions"
      content={[
        "By accessing or using our services, you agree to our terms.",
        "All products are subject to availability.",
        "We reserve the right to modify these terms at any time.",
      ]}
    />
  );
};

export default TermsConditions;
