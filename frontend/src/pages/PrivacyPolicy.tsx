import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="privacy-policy">
      <Navbar />

      {/* Hero Section */}
      <section className="policy-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="hero-subtitle">
            How we protect and use your information
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="section policy-section">
        <div className="container">
          <div className="policy-content">
            <div className="policy-article">
              <h2>Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account,
                participate in community events, or contact us for support. This may include your name,
                email address, phone number, and other contact information.
              </p>
            </div>

            <div className="policy-article">
              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services,
                communicate with you, and ensure the safety and security of our community platform.
                We may also use your information to send you updates about community events and
                important announcements.
              </p>
            </div>

            <div className="policy-article">
              <h2>Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties
                without your consent, except as described in this policy. We may share your information
                in limited circumstances, such as with service providers who help us operate our platform
                or when required by law.
              </p>
            </div>

            <div className="policy-article">
              <h2>Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </div>

            <div className="policy-article">
              <h2>Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information. You may also
                opt out of receiving promotional communications from us. To exercise these rights,
                please contact us using the information provided on our Contact Us page.
              </p>
            </div>

            <div className="policy-article">
              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new policy on this page and updating the "Last Updated" date.
              </p>
              <p><strong>Last Updated:</strong> April 29, 2026</p>
            </div>

            <div className="policy-article">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at
                privacy@jatpeople.com or through our Contact Us page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;