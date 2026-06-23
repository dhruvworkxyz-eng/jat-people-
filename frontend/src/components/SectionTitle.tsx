import React from 'react';
import './SectionTitle.css';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, centered = true }) => {
  return (
    <div className={`section-title ${centered ? 'centered' : ''}`}>
      <h2 className="title">{title}</h2>
      {subtitle && <p className="subtitle">{subtitle}</p>}
      <div className="title-decoration">
        <div className="decoration-line"></div>
        <div className="decoration-dot"></div>
        <div className="decoration-line"></div>
      </div>
    </div>
  );
};

export default SectionTitle;