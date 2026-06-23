import React from 'react';
import {
  FaAmbulance,
  FaBalanceScale,
  FaBookOpen,
  FaBriefcase,
  FaHandsHelping,
  FaHeartbeat,
  FaPhoneAlt,
  FaShieldAlt,
  FaUsers
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import { helplineContacts } from '../data/sampleData';
import './JatHelpline.css';

const HELPLINE_PHONE = '9999885350';
const HELPLINE_TEL = `tel:+91${HELPLINE_PHONE}`;
const HELPLINE_DISPLAY = '+91 99998 85350';

const supportServices = [
  {
    icon: FaAmbulance,
    title: 'Emergency Response',
    description: 'Fast guidance for urgent medical, accident, travel, or safety situations.'
  },
  {
    icon: FaBalanceScale,
    title: 'Legal Aid',
    description: 'Initial legal direction, documentation help, and referral support.'
  },
  {
    icon: FaHeartbeat,
    title: 'Medical Support',
    description: 'Hospital guidance, health referrals, blood help, and treatment coordination.'
  },
  {
    icon: FaBriefcase,
    title: 'Business Help',
    description: 'Advice for jobs, business needs, local networking, and financial direction.'
  },
  {
    icon: FaUsers,
    title: 'Family Support',
    description: 'Confidential guidance for family mediation, counseling, and welfare needs.'
  },
  {
    icon: FaBookOpen,
    title: 'Education Aid',
    description: 'Scholarship, admission, career, and student mentorship information.'
  }
];

const JatHelpline: React.FC = () => {
  return (
    <div className="jat-helpline">
      <Navbar />

      <section className="helpline-hero">
        <div className="container helpline-hero-inner">
          <div className="helpline-hero-copy">
            <span className="helpline-kicker">Community Support Desk</span>
            <h1>Jat Helpline</h1>
            <p className="hero-subtitle">
              Quick help for urgent support, medical guidance, legal direction, family matters, and community referrals.
            </p>
            <div className="hero-actions">
              <a className="call-btn primary-call" href={HELPLINE_TEL}>
                <FaPhoneAlt aria-hidden="true" />
                Call Now
              </a>
              <a className="secondary-call" href="#help-request">
                Request Help
              </a>
            </div>
          </div>

          <div className="helpline-hero-card" aria-label="Primary helpline number">
            <FaShieldAlt aria-hidden="true" />
            <span>Helpline Number</span>
            <strong>{HELPLINE_DISPLAY}</strong>
            <a href={HELPLINE_TEL}>Tap to call</a>
          </div>
        </div>
      </section>

      <section className="section emergency-section">
        <div className="container">
          <SectionTitle
            title="Emergency Support"
            subtitle="One verified number for quick assistance across common support needs"
          />

          <div className="emergency-grid">
            {helplineContacts.map((contact, index) => (
              <div key={index} className="helpline-card">
                <div className="helpline-header">
                  <h3>{contact.title}</h3>
                  <span className={`helpline-type ${contact.type.toLowerCase()}`}>{contact.type}</span>
                </div>
                <p className="helpline-description">{contact.description}</p>
                <div className="helpline-contact">
                  <span className="helpline-number">{HELPLINE_DISPLAY}</span>
                  <a className="call-btn" href={HELPLINE_TEL}>
                    <FaPhoneAlt aria-hidden="true" />
                    Call Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section support-section">
        <div className="container">
          <SectionTitle
            title="Support Services"
            subtitle="Comprehensive assistance across various needs"
          />

          <div className="support-grid">
            {supportServices.map(service => {
              const Icon = service.icon;
              return (
                <div className="support-card" key={service.title}>
                  <div className="support-icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section contact-section" id="help-request">
        <div className="container">
          <SectionTitle
            title="Get Help"
            subtitle="Submit your request and our team will assist you"
          />

          <div className="contact-form-container">
            <form className="helpline-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Help Category</label>
                  <select id="category" name="category" required>
                    <option value="">Select Category</option>
                    <option value="emergency">Emergency</option>
                    <option value="legal">Legal Aid</option>
                    <option value="medical">Medical</option>
                    <option value="business">Business</option>
                    <option value="family">Family Support</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Describe Your Situation</label>
                <textarea id="message" name="message" rows={5} required></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <FaHandsHelping aria-hidden="true" />
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JatHelpline;
