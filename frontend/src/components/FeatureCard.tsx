import React from 'react';
import './FeatureCard.css';

interface FeatureCardProps {
  icon?: string;
  image?: string;
  imagePosition?: string;
  title: string;
  description: string;
  count?: string;
  variant?: 'default' | 'glass' | 'gradient';
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  image,
  imagePosition,
  title,
  description,
  count,
  variant = 'default',
  onClick
}) => {
  const imageStyle = imagePosition
    ? ({ '--card-image-position': imagePosition } as React.CSSProperties)
    : undefined;

  return (
    <div className={`feature-card ${variant} ${image ? 'has-image' : ''}`} onClick={onClick}>
      {image && (
        <div className="card-image-wrap">
          <img src={image} alt="" className="card-image" style={imageStyle} loading="lazy" />
        </div>
      )}
      <div className="card-body">
        {icon && <span className="card-icon">{icon}</span>}
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
      {count && <span className="card-count">{count}</span>}
    </div>
  );
};

export default FeatureCard;
