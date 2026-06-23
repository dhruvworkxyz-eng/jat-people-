import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <h3 className="footer-logo">
              <img src="/haryana-jat-logo.svg" alt="" />
              Jat People
            </h3>
            <p className="footer-description">
              A premium digital platform connecting the global Jat community through heritage,
              gotras, organisations, events, clubs, and support.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/officialjatpeople/reels" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://www.instagram.com/officialjatpeople/" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.youtube.com/@JATPEOPLE" className="social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
              <a href="https://www.linkedin.com/in/jatpeople" className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/about-jat">About Jat</Link></li>
              <li><Link to="/jat-gotras">Gotras</Link></li>
              <li><Link to="/area-wise-jat">Areas</Link></li>
              <li><Link to="/profession-wise-jat">Professions</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/events">Events</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Community</h4>
            <ul className="footer-links">
              <li><Link to="/jat-organisation">Organisations</Link></li>
              <li><Link to="/jat-club">Clubs</Link></li>
              <li><Link to="/jat-helpline">Helpline</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/religion-wise-jat">Faith Communities</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Contact</h4>
            <div className="footer-contact">
              <p>info@jatpeople.com</p>
              <p>+91-1800-JAT-HELP</p>
              <p>Global Jat Network</p>
            </div>
            <form className="footer-newsletter">
              <h5>Newsletter</h5>
              <div className="newsletter-input">
                <input type="email" placeholder="Enter your email" aria-label="Email address" />
                <button type="submit">Subscribe</button>
              </div>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2026 Jat People. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-conditions">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
