import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import joginderMannPhoto from '../assets/joginder-mann.jpg';
import './AboutJat.css';

const AboutJat: React.FC = () => {
  return (
    <div className="about-jat">
      <Navbar />

      <main className="about-founder-section">
        <div className="container about-founder-layout">
          <div className="about-founder-photo">
            <img src={joginderMannPhoto} alt="Joginder Mann, founder of Jat People" />
          </div>

          <article className="about-founder-content">
            <span className="about-kicker">About Jat People</span>
            <h1>About Jat People</h1>

            <p>
              Jat People is an initiative founded by <strong>Joginder Mann</strong>, who successfully organized
              and hosted the Jat Samelan, bringing together members of the community from different regions.
              Building on the success of these gatherings, the initiative is now focused on strengthening
              unity, collaboration, and community development through regular Samelans and digital connectivity.
            </p>

            <p>
              The Jat People website serves as a dedicated platform to connect individuals, families,
              professionals, entrepreneurs, and community leaders. Through its comprehensive directory,
              members can discover and connect with one another, expand professional networks, and foster
              stronger relationships within the community.
            </p>

            <p>
              Our mission is to preserve cultural values, encourage mutual support, and create opportunities
              for growth by bringing the Jat community together both offline through Samelans and online
              through our digital directory and networking platform.
            </p>

            <p>
              Together, we aim to build a more connected, empowered, and united Jat community for future generations.
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutJat;
