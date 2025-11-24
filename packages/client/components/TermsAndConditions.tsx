
import React from 'react';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
      <div className="prose dark:prose-invert">
        <p>This is a placeholder for the Terms & Conditions page. Replace this with your actual terms and conditions.</p>
        <h3>1. Introduction</h3>
        <p>Welcome to our application. By using our services, you agree to these terms.</p>
        <h3>2. User Accounts</h3>
        <p>You are responsible for maintaining the confidentiality of your account and password.</p>
        <h3>3. Services</h3>
        <p>We provide a platform to connect users with service providers. We are not responsible for the services provided by the providers.</p>
        <h3>4. Limitation of Liability</h3>
        <p>We are not liable for any damages arising from the use of our services.</p>
      </div>
    </div>
  );
};
