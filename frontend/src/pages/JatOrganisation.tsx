import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import { organisations } from '../data/sampleData';
import './JatOrganisation.css';

const JatOrganisation: React.FC = () => {
  return (
    <div className="jat-organisation">
      <Navbar />

      {/* Hero Section */}
      <section className="organisation-hero">
        <div className="container">
          <h1>Jat Organisations</h1>
          <p className="hero-subtitle">
            Premier organizations representing and serving the Jat community
          </p>
        </div>
      </section>

      {/* Organisations Section */}
      <section className="section organisations-section">
        <div className="container">
          <SectionTitle
            title="Leading Organizations"
            subtitle="Organizations dedicated to Jat community welfare and advancement"
          />

          <div className="organisations-grid">
            {organisations.map((org, index) => (
              <div key={index} className="organisation-card">
                <div className="org-header">
                  <h3>{org.name}</h3>
                  <span className="org-members">{org.members} members</span>
                </div>
                <p className="org-description">{org.description}</p>
                <div className="org-footer">
                  <span className="org-founded">Founded: {org.founded}</span>
                  <button className="join-org-btn">Join Organization</button>
                </div>
              </div>
            ))}
          </div>

          {/* Organization Types */}
          <div className="org-types">
            <div className="type-card">
              <h4>🏛️ National Bodies</h4>
              <p>All India Jat Mahasabha and other national-level organizations</p>
            </div>
            <div className="type-card">
              <h4>🏛️ State Organizations</h4>
              <p>State-specific Jat organizations and federations</p>
            </div>
            <div className="type-card">
              <h4>🌍 International Groups</h4>
              <p>Global Jat organizations and diaspora networks</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JatOrganisation;