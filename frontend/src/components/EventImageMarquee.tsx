import React from 'react';
import samelanPhoto1 from '../assets/1.jpg';
import samelanPhoto2 from '../assets/2.jpg';
import samelanPhoto3 from '../assets/3.jpg';
import samelanPhoto4 from '../assets/4.jpg';
import samelanPhoto5 from '../assets/5.jpg';
import samelanPhoto6 from '../assets/6.jpg';
import samelanPhoto7 from '../assets/7.jpg';
import samelanPhoto8 from '../assets/8.jpg';
import samelanPhoto9 from '../assets/9.jpg';
import samelanPhoto10 from '../assets/10.jpg';
import samelanPhoto11 from '../assets/11.jpg';
import samelanPhoto12 from '../assets/12.jpg';
import '../components/EventImageMarquee.css';

const eventImages = [
  { src: samelanPhoto1, alt: 'Jaat Samelan guests seated at the event' },
  { src: samelanPhoto2, alt: 'Jaat Samelan speaker on stage' },
  { src: samelanPhoto3, alt: 'Jaat Samelan cultural performance' },
  { src: samelanPhoto4, alt: 'Jaat Samelan community moment' },
  { src: samelanPhoto5, alt: 'Jaat Samelan event gathering' },
  { src: samelanPhoto6, alt: 'Jaat Samelan audience and stage' },
  { src: samelanPhoto7, alt: 'Jaat Samelan celebration photo' },
  { src: samelanPhoto8, alt: 'Jaat Samelan members together' },
  { src: samelanPhoto9, alt: 'Jaat Samelan event highlight' },
  { src: samelanPhoto10, alt: 'Jaat Samelan community highlight' },
  { src: samelanPhoto11, alt: 'Jaat Samelan program memory' },
  { src: samelanPhoto12, alt: 'Jaat Samelan shared moment' }
];

const EventImageMarquee: React.FC = () => {
  const marqueeImages = [...eventImages, ...eventImages];

  return (
    <section className="event-marquee-section" aria-label="Jaat Samelan event photos">
      <div className="event-marquee-heading">
        <span>Jaat Samelan Gallery</span>
        <h2>Moments from the community event</h2>
      </div>

      <div className="event-marquee-shell">
        <div className="event-marquee-track">
          {marqueeImages.map((image, index) => (
            <figure className="event-marquee-card" key={`${image.src}-${index}`}>
              <img src={image.src} alt={image.alt} loading={index < eventImages.length ? 'eager' : 'lazy'} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventImageMarquee;
