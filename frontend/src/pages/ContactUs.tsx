import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import './ContactUs.css';

const ContactUs: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    setSubmitted(true);
  };

  return (
    <div className="contact-us">
      <Navbar />

      <section className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="hero-subtitle">
            Get in touch with the Jat People community
          </p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container">
          <SectionTitle title="Send us a Message" subtitle="We'd love to hear from you" />

          <div className="contact-content">
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={handleSubmit}>
                {submitted && (
                  <div className="form-success" role="status">
                    Thanks. Your message has been prepared for the community team.
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input type="text" id="name" name="name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input type="tel" id="phone" name="phone" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input type="email" id="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select id="subject" name="subject" required>
                      <option value="">Select Subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="gotra">Gotra Information</option>
                      <option value="events">Events</option>
                      <option value="helpline">Helpline Support</option>
                      <option value="business">Business Partnership</option>
                      <option value="media">Media Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" name="message" rows={6} required></textarea>
                </div>

                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>

            <div className="contact-info">
              <div className="info-card">
                <h4>Email Us</h4>
                <p>info@jatpeople.com</p>
                <p>support@jatpeople.com</p>
              </div>
              <div className="info-card">
                <h4>Call Us</h4>
                <p>+91-1800-JAT-HELP</p>
                <p>Mon-Fri: 9AM-6PM IST</p>
              </div>
              <div className="info-card">
                <h4>Visit Us</h4>
                <p>Jat People Headquarters</p>
                <p>Rohtak, Haryana, India</p>
              </div>
              <div className="info-card">
                <h4>Response Time</h4>
                <p>We respond to all inquiries within 24 hours</p>
                <p>Emergency: Immediate response</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-presence-section">
        <div className="container">
          <SectionTitle title="Community Presence" subtitle="Regional representatives and community support" />

          <div className="presence-panel">
            <div className="presence-content">
              <span className="presence-kicker">India and global diaspora</span>
              <h3>Find the nearest community connection</h3>
              <p>
                Jat People connects regional organisations, clubs, events, and helpline resources
                across India and international communities.
              </p>
              <button className="find-location-btn">Find Nearest Location</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
