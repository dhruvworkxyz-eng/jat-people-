import React from 'react';
import { FaAward, FaBriefcase, FaFlag, FaLandmark, FaMedal, FaTrophy, FaUsers } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import './JatWorldRecords.css';

const notablePeople = [
  {
    name: 'Neeraj Chopra',
    field: 'Sports',
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Neeraj%20Chopra%20in%20December%202021.jpg',
    achievement: "Olympic Gold Medalist and World Champion in javelin throw, becoming one of India's greatest athletes."
  },
  {
    name: 'Virender Sehwag',
    field: 'Sports',
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Virender%20Sehwag%202012.jpg',
    achievement: 'One of the most explosive batsmen in cricket history, holding multiple international records.'
  },
  {
    name: 'Sakshi Malik',
    field: 'Sports',
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Sakshi%20Malik%20in%202016.jpg',
    achievement: "India's first female wrestler to win an Olympic medal."
  },
  {
    name: 'Bajrang Punia',
    field: 'Sports',
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Bajrang%20Punia%20in%202015.jpg',
    achievement: 'Olympic medalist and multiple-time international wrestling champion.'
  },
  {
    name: 'Major Hoshiar Singh',
    field: 'Defense & Military',
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Major%20Hoshiar%20Singh.jpg',
    achievement: "Awarded the Param Vir Chakra, India's highest military honor, for exceptional bravery during the 1971 Indo-Pak War."
  },
  {
    name: 'Chaudhary Charan Singh',
    field: 'Politics & Public Leadership',
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Chaudhary%20Charan%20Singh.jpg',
    achievement: "Former Prime Minister of India and a champion of farmers' rights."
  },
  {
    name: 'Chaudhary Devi Lal',
    field: 'Politics & Public Leadership',
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Chaudhary%20Devi%20Lal.jpg',
    achievement: 'Respected farmer leader and statesman.'
  }
];

const achievementSections = [
  {
    title: 'Sports',
    icon: FaTrophy,
    text: 'The Jat community has produced internationally recognized athletes in athletics, cricket, wrestling, and many other sports. Their achievements have brought pride to India and inspired future generations.'
  },
  {
    title: 'Defense & Military',
    icon: FaMedal,
    text: 'Major Hoshiar Singh and numerous Jat soldiers and officers represent a long tradition of courage, discipline, and service. Many have received gallantry awards for their service to the nation.'
  },
  {
    title: 'Politics & Public Leadership',
    icon: FaLandmark,
    text: "Leaders such as Chaudhary Charan Singh and Chaudhary Devi Lal played major roles in public life, farmer advocacy, governance, and social leadership."
  },
  {
    title: 'Business & Entrepreneurship',
    icon: FaBriefcase,
    text: 'Jat entrepreneurs and professionals have established successful businesses in India and abroad, contributing significantly to economic growth, innovation, and employment generation.'
  },
  {
    title: 'Community Leadership',
    icon: FaUsers,
    text: 'Through educational institutions, social organizations, and community initiatives such as Jat Samelans, leaders continue to promote unity, cultural heritage, and social development across the world.'
  }
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const JatWorldRecords: React.FC = () => {
  return (
    <div className="jat-records-page">
      <Navbar />

      <section className="records-hero">
        <div className="container records-hero-inner">
          <div>
            <span className="records-kicker">Jat Book of World Records</span>
            <h1>Notable Achievements of Jat Personalities</h1>
            <p className="hero-subtitle">
              The Jat community has produced many distinguished personalities who have brought pride to India and earned
              recognition worldwide through their achievements in sports, military service, politics, business, and social leadership.
            </p>
          </div>
          <div className="records-hero-card">
            <FaAward aria-hidden="true" />
            <strong>Hard work. Courage. Leadership.</strong>
            <span>A tribute to Jat personalities whose dedication continues to inspire the community.</span>
          </div>
        </div>
      </section>

      <section className="section records-people-section">
        <div className="container">
          <SectionTitle
            title="Featured Jat Personalities"
            subtitle="Recognized achievers across sports, defence, politics, and public leadership"
          />

          <div className="people-record-grid">
            {notablePeople.map(person => (
              <article className="person-record-card" key={person.name}>
                <div className="person-photo-wrap">
                  <span className="person-photo-fallback">{getInitials(person.name)}</span>
                  <img
                    src={person.image}
                    alt={person.name}
                    loading="lazy"
                    onError={event => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="person-record-content">
                  <span>{person.field}</span>
                  <h3>{person.name}</h3>
                  <p>{person.achievement}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section records-section">
        <div className="container">
          <SectionTitle
            title="Achievement Areas"
            subtitle="The values reflected through generations of Jat achievement"
          />

          <div className="records-grid">
            {achievementSections.map(item => {
              const Icon = item.icon;
              return (
                <article className="record-category-card" key={item.title}>
                  <span className="record-icon"><Icon aria-hidden="true" /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>

          <div className="records-closing-panel">
            <FaFlag aria-hidden="true" />
            <p>
              The achievements of these personalities reflect the values of hard work, courage, leadership,
              and dedication that have long been associated with the Jat community.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JatWorldRecords;
