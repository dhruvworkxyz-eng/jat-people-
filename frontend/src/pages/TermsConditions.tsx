import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TermsConditions.css';

const TermsConditions: React.FC = () => {
  return (
    <div className="terms-conditions">
      <Navbar />

      {/* Hero Section */}
      <section className="terms-hero">
        <div className="container">
          <h1>Terms & Conditions</h1>
          <p className="hero-subtitle">
            Terms of use for Jat People platform
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section terms-section">
        <div className="container">
          <div className="terms-content">
            <div className="terms-article">
              <h2>Acceptance of Terms</h2>
              <p>
                By accessing and using the Jat People platform, you accept and agree to be bound by
                the terms and provision of this agreement. If you do not agree to abide by the above,
                please do not use this service.
              </p>
            </div>

            <div className="terms-article">
              <h2>Use License</h2>
              <p>
                Permission is granted to temporarily access the materials on Jat People's website
                for personal, non-commercial transitory viewing only. This is the grant of a license,
                not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>

            <div className="terms-article">
              <h2>User Responsibilities</h2>
              <p>
                As a user of our platform, you agree to:
              </p>
              <ul>
                <li>Provide accurate and complete information when registering</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the platform in accordance with applicable laws and regulations</li>
                <li>Respect the rights and dignity of other community members</li>
                <li>Not engage in any harmful, offensive, or inappropriate behavior</li>
              </ul>
            </div>

            <div className="terms-article">
              <h2>Community Guidelines</h2>
              <p>
                Our platform is built on respect, inclusivity, and positive community engagement.
                Users are expected to:
              </p>
              <ul>
                <li>Treat all community members with respect and courtesy</li>
                <li>Avoid discriminatory language or behavior</li>
                <li>Contribute positively to discussions and community activities</li>
                <li>Report any inappropriate content or behavior</li>
                <li>Protect the privacy and personal information of others</li>
              </ul>
            </div>

            <div className="terms-article">
              <h2>Content Ownership</h2>
              <p>
                The platform and its original content, features, and functionality are and will remain
                the exclusive property of Jat People and its licensors. The platform is protected by
                copyright, trademark, and other laws.
              </p>
            </div>

            <div className="terms-article">
              <h2>Disclaimer</h2>
              <p>
                The information on this platform is provided on an 'as is' basis. To the fullest extent
                permitted by law, Jat People excludes all representations, warranties, conditions and
                terms whether express or implied, statutory or otherwise.
              </p>
            </div>

            <div className="terms-article">
              <h2>Limitation of Liability</h2>
              <p>
                In no event shall Jat People, nor its directors, employees, partners, agents, suppliers,
                or affiliates, be liable for any indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other
                intangible losses.
              </p>
            </div>

            <div className="terms-article">
              <h2>Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the platform immediately,
                without prior notice or liability, under our sole discretion, for any reason whatsoever
                and without limitation, including but not limited to a breach of the Terms.
              </p>
            </div>

            <div className="terms-article">
              <h2>Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any
                time. If a revision is material, we will provide at least 30 days notice prior to any
                new terms taking effect.
              </p>
              <p><strong>Last Updated:</strong> April 29, 2026</p>
            </div>

            <div className="terms-article">
              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms & Conditions, please contact us at
                legal@jatpeople.com or through our Contact Us page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsConditions;