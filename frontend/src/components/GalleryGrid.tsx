import React from 'react';
import './GalleryGrid.css';

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick?: (image: GalleryImage) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images, onImageClick }) => {
  return (
    <div className="gallery-grid">
      {images.map((image, index) => (
        <div
          key={index}
          className="gallery-item"
          onClick={() => onImageClick?.(image)}
        >
          <div className="gallery-image-container">
            <img
              src={image.src}
              alt={image.alt}
              className="gallery-image"
              loading="lazy"
            />
            <div className="gallery-overlay">
              <span className="gallery-category">{image.category}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;