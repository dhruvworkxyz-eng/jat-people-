import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import FeatureCard from '../components/FeatureCard';
import SearchBar from '../components/SearchBar';
import { professions } from '../data/sampleData';
import './ProfessionWiseJat.css';

const ProfessionWiseJat: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const filteredProfessions = professions.filter(profession =>
    `${profession.name} ${profession.description}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const groupedProfessions = filteredProfessions
    .toSorted((first, second) => first.name.localeCompare(second.name))
    .reduce<Record<string, typeof professions>>((groups, profession) => {
      const firstLetter = profession.name.charAt(0).toUpperCase();
      const heading = /^[A-Z]$/.test(firstLetter) ? firstLetter : '#';

      return {
        ...groups,
        [heading]: [...(groups[heading] || []), profession]
      };
    }, {});

  return (
    <div className="profession-wise-jat">
      <Navbar />

      <section className="profession-hero">
        <div className="container">
          <h1>Jat Professional Excellence</h1>
          <p className="hero-subtitle">
            Celebrating Jats excelling in diverse fields and industries
          </p>
        </div>
      </section>

      <section className="section professions-section">
        <div className="container">
          <SectionTitle
            title="Professional Diversity"
            subtitle={searchQuery ? `${filteredProfessions.length} profession${filteredProfessions.length === 1 ? '' : 's'} found` : 'Jats making significant contributions across various professions'}
          />

          <div className="directory-search">
            <SearchBar placeholder="Search professions..." onSearch={setSearchQuery} />
          </div>

          {filteredProfessions.length > 0 ? (
            <div className="profession-alphabet-list">
              {Object.keys(groupedProfessions).map(heading => (
              <section className="profession-letter-section" key={heading}>
                <div className="profession-letter-heading">
                  <span>{heading}</span>
                  <p>{groupedProfessions[heading].length} profession{groupedProfessions[heading].length === 1 ? '' : 's'}</p>
                </div>

                <div className="professions-grid">
                  {groupedProfessions[heading].map(profession => (
                    <FeatureCard
                      key={profession.name}
                      title={profession.name}
                      description={profession.description}
                      onClick={() => navigate(`/profession-wise-jat/${encodeURIComponent(profession.name)}`)}
                    />
                  ))}
                </div>
              </section>
              ))}
            </div>
          ) : (
            <div className="empty-members">
              <h3>No professions found</h3>
              <p>Try another search term.</p>
            </div>
          )}

          <div className="career-guidance">
            <div className="guidance-card">
              <h4>Career Development</h4>
              <p>
                Access mentorship programs, networking opportunities, and career guidance
                tailored for Jat community members pursuing various professional paths.
              </p>
            </div>
            <div className="guidance-card">
              <h4>Professional Network</h4>
              <p>
                Connect with successful Jat professionals in your field. Share experiences,
                seek advice, and build meaningful professional relationships.
              </p>
            </div>
            <div className="guidance-card">
              <h4>Success Stories</h4>
              <p>
                Read inspiring stories of Jat achievers who have made significant contributions
                in their respective fields and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfessionWiseJat;
