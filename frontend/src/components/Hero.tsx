import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaHandsHelping, FaNetworkWired, FaShieldAlt } from 'react-icons/fa';
import samelanPhoto1 from '../assets/1.jpg';
import samelanPhoto2 from '../assets/2.jpg';
import samelanPhoto3 from '../assets/3.jpg';
import samelanPhoto4 from '../assets/4.jpg';
import samelanPhoto5 from '../assets/5.jpg';
import samelanPhoto6 from '../assets/6.jpg';
import './Hero.css';

const heroSamelanPhotos = [
  samelanPhoto3,
  samelanPhoto2,
  samelanPhoto1,
  samelanPhoto4,
  samelanPhoto5,
  samelanPhoto6
];

const Hero: React.FC = () => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActivePhotoIndex(currentIndex => (currentIndex + 1) % heroSamelanPhotos.length);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="hero premium-hero">
      <div className="hero-bg">
        <span className="hero-glow hero-glow-one"></span>
        <span className="hero-glow hero-glow-two"></span>
        <span className="hero-glow hero-glow-three"></span>
        <span className="floating-shape shape-cube"></span>
        <span className="floating-shape shape-ring"></span>
        <span className="floating-shape shape-diamond"></span>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <FaNetworkWired />
          <span>Global Jat Community Platform</span>
        </div>

        <h1 className="hero-title">
          Jat Samaj: Unity, Heritage & Progress
        </h1>

        <p className="hero-subtitle">
          Explore gotras, regions, organisations, events, clubs, and support resources inside
          a premium digital home built for the worldwide Jat community.
        </p>

        <div className="hero-cta">
          <Link to="/jat-gotras" className="hero-btn hero-btn-primary">
            Explore Gotras <FaArrowRight />
          </Link>
          <Link to="/jat-club" className="hero-btn hero-btn-glass">
            Join Community
          </Link>
          <Link to="/jat-organisation" className="hero-btn hero-btn-outline">
            View Directory
          </Link>
        </div>

        <div className="hero-trust-row">
          <div>
            <FaShieldAlt />
            <span>Heritage verified structure</span>
          </div>
          <div>
            <FaHandsHelping />
            <span>Community-first support</span>
          </div>
        </div>
      </div>

      <div className="hero-samelan-visual" aria-label="Jaat Samelan photo highlight">
        <div className="hero-photo-frame">
          {heroSamelanPhotos.map((photo, index) => (
            <img
              key={photo}
              src={photo}
              alt="Jaat Samelan community highlight"
              className={index === activePhotoIndex ? 'active' : ''}
            />
          ))}
          <div className="hero-photo-caption">
            <span>22 March</span>
            <strong>Jaat Samelan</strong>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
