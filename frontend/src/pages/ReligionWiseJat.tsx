import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaHandsHelping, FaPeopleArrows, FaPrayingHands, FaSearch, FaUsers } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import SearchBar from '../components/SearchBar';
import { religions } from '../data/sampleData';
import './ReligionWiseJat.css';

const religionIcons = [FaPrayingHands, FaPeopleArrows, FaHandsHelping, FaUsers];

const ReligionWiseJat: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const filteredReligions = religions.filter(religion =>
    `${religion.name} ${religion.description}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="religion-wise-jat">
      <Navbar />

      <section className="religion-hero">
        <div className="container religion-hero-layout">
          <div className="religion-hero-copy">
            <span className="religion-eyebrow">Faith Directory</span>
            <h1>Jat Communities by Faith</h1>
            <p className="hero-subtitle">
              Explore Hindu, Sikh, Muslim, and other Jat communities through a clean directory built around shared heritage.
            </p>
          </div>

          <div className="religion-hero-panel" aria-label="Religion wise directory highlights">
            <div>
              <strong>{religions.length}</strong>
              <span>Faith groups</span>
            </div>
            <div>
              <strong>1</strong>
              <span>Shared identity</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Community access</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section religions-section">
        <div className="container">
          <SectionTitle
            title="Religious Diversity"
            subtitle={searchQuery ? `${filteredReligions.length} religion${filteredReligions.length === 1 ? '' : 's'} found` : 'Jat community across different faiths and spiritual traditions'}
          />

          <div className="directory-search religion-search-shell">
            <FaSearch aria-hidden="true" />
            <SearchBar placeholder="Search religions..." onSearch={setSearchQuery} />
          </div>

          {filteredReligions.length > 0 ? (
            <div className="religions-grid">
              {filteredReligions.map((religion, index) => {
                const Icon = religionIcons[index % religionIcons.length];
                const memberCount = 'members' in religion && Array.isArray(religion.members) ? religion.members.length : 0;

                return (
                  <article
                    className="religion-card"
                    key={religion.name}
                    onClick={() => navigate(`/religion-wise-jat/${encodeURIComponent(religion.name)}`)}
                  >
                    <div className="religion-card-top">
                      <span className="religion-icon"><Icon aria-hidden="true" /></span>
                      <span className="religion-count">{memberCount ? `${memberCount} listed` : 'Open directory'}</span>
                    </div>
                    <h3>{religion.name}</h3>
                    <p>{religion.description}</p>
                    <button type="button" className="religion-card-link">
                      View members <FaArrowRight aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-members">
              <h3>No religions found</h3>
              <p>Try another search term.</p>
            </div>
          )}

          <div className="unity-message">
            <div className="unity-card">
              <h4>Unity in Diversity</h4>
              <p>
                Despite following different faiths, Jats share common values of courage, hard work,
                and community service. Our religious diversity enriches our cultural heritage while
                maintaining strong family and community bonds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReligionWiseJat;
