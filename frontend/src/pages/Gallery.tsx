import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import GalleryGrid from '../components/GalleryGrid';
import { galleryImages } from '../data/sampleData';
import './Gallery.css';

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category)))];

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="gallery">
      <Navbar />

      <section className="gallery-hero">
        <div className="container">
          <h1>Jat Community Gallery</h1>
          <p className="hero-subtitle">
            Explore cultural moments, regional heritage, agriculture, youth, and community life
          </p>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="container">
          <SectionTitle
            title="Photo Gallery"
            subtitle="A polished visual archive of heritage, achievement, and community connection"
          />

          <div className="gallery-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <GalleryGrid images={filteredImages} onImageClick={setSelectedImage} />

          <div className="gallery-upload">
            <div className="upload-card">
              <h4>Share Your Moments</h4>
              <p>
                Contribute to our growing gallery by sharing photos of Jat cultural events,
                family gatherings, achievements, and community initiatives.
              </p>
              <button className="upload-btn">Upload Photos</button>
            </div>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={selectedImage.alt}>
          <button className="gallery-modal-backdrop" onClick={() => setSelectedImage(null)} aria-label="Close gallery preview" />
          <div className="gallery-modal-content">
            <button className="gallery-modal-close" onClick={() => setSelectedImage(null)} aria-label="Close gallery preview">
              Close
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <div className="gallery-modal-caption">
              <span>{selectedImage.category}</span>
              <p>{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
