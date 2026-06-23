import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import SearchBar from '../components/SearchBar';
import { sortedGotras } from '../data/sampleData';
import './JatGotras.css';

const JatGotras: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGotras, setFilteredGotras] = useState(sortedGotras);
  const groupedGotras = useMemo(() => {
    return filteredGotras.reduce<Record<string, string[]>>((groups, gotra) => {
      const heading = gotra.charAt(0).toUpperCase();
      const groupKey = /^[A-Z]$/.test(heading) ? heading : '#';

      return {
        ...groups,
        [groupKey]: [...(groups[groupKey] || []), gotra]
      };
    }, {});
  }, [filteredGotras]);

  const alphabetHeadings = useMemo(() => Object.keys(groupedGotras).sort(), [groupedGotras]);

  const getGotraPath = (gotra: string) => `/jat-gotras/${encodeURIComponent(gotra)}`;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredGotras(sortedGotras);
    } else {
      const filtered = sortedGotras.filter(gotra =>
        gotra.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredGotras(filtered);
    }
  };

  return (
    <div className="jat-gotras">
      <Navbar />

      {/* Hero Section */}
      <section className="gotras-hero">
        <div className="container">
          <h1>Jat Gotras</h1>
          <p className="hero-subtitle">
            Discover and connect with your ancestral lineage
          </p>
          <div className="search-section">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Gotras Grid */}
      <section className="section gotras-section">
        <div className="container">
          <SectionTitle
            title="Explore Gotras"
            subtitle={searchQuery ? `Found ${filteredGotras.length} gotras matching "${searchQuery}"` : "Browse through our comprehensive collection of Jat gotras"}
          />

          {filteredGotras.length > 0 ? (
            <div className="gotra-alphabet-list">
              {alphabetHeadings.map(heading => (
                <section className="gotra-letter-section" key={heading}>
                  <div className="gotra-letter-heading">
                    <span>{heading}</span>
                    <p>{groupedGotras[heading].length} gotra{groupedGotras[heading].length === 1 ? '' : 's'}</p>
                  </div>
                  <div className="gotras-grid">
                    {groupedGotras[heading].map(gotra => (
                      <div key={gotra} className="gotra-card">
                        <div className="gotra-header">
                          <span className="gotra-name">{gotra}</span>
                          <span className="gotra-icon" aria-hidden="true">JP</span>
                        </div>
                        <div className="gotra-actions">
                          <Link className="connect-btn" to={getGotraPath(gotra)}>Show Members</Link>
                          <button className="learn-more-btn">Learn More</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No gotras found</h3>
              <p>Try adjusting your search terms or browse all gotras.</p>
              <button
                className="reset-search-btn"
                onClick={() => handleSearch('')}
              >
                Show All Gotras
              </button>
            </div>
          )}

          {/* Info Section */}
          <div className="gotras-info">
            <div className="info-card">
              <h4>About Gotras</h4>
              <p>
                Gotras represent ancestral lineages in the Jat community. Each gotra has its own
                history, traditions, and significance. Understanding your gotra helps connect with
                your heritage and community.
              </p>
            </div>
            <div className="info-card">
              <h4>Connect with Family</h4>
              <p>
                Use our platform to connect with members of your gotra worldwide. Share family
                history, organize reunions, and strengthen community bonds.
              </p>
            </div>
            <div className="info-card">
              <h4>Research Your Roots</h4>
              <p>
                Access detailed information about your gotra's history, notable personalities,
                and cultural significance. Contribute to our growing knowledge base.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JatGotras;
