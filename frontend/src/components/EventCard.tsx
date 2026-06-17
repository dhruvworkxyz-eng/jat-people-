import React, { useEffect, useMemo, useState } from 'react';
import './EventCard.css';

interface Event {
  title: string;
  date: string;
  displayDate?: string;
  location: string;
  description: string;
  type: string;
  image?: string;
  images?: string[];
  actionLabel?: string;
  registrationClosed?: boolean;
}

interface EventCardProps {
  event: Event;
  onRegister?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const shouldRotateImages = event.registrationClosed && event.date.startsWith('2026') && Boolean(event.images?.length);
  const eventImages = useMemo(
    () => (shouldRotateImages ? event.images || [] : event.image ? [event.image] : []),
    [event.image, event.images, shouldRotateImages]
  );
  const activeImage = eventImages[activeImageIndex % Math.max(eventImages.length, 1)];

  useEffect(() => {
    if (!shouldRotateImages || eventImages.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveImageIndex(currentIndex => (currentIndex + 1) % eventImages.length);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [eventImages.length, shouldRotateImages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`event-card${activeImage ? ' event-card-with-image' : ''}`}>
      {activeImage && (
        <div className="event-photo">
          <img src={activeImage} alt={`${event.title} event memory ${activeImageIndex + 1}`} />
          {shouldRotateImages && eventImages.length > 1 && (
            <span className="event-photo-counter">
              {activeImageIndex + 1}/{eventImages.length}
            </span>
          )}
        </div>
      )}
      <div className="event-header">
        <span className="event-type">{event.type}</span>
        <span className="event-date">{event.displayDate || formatDate(event.date)}</span>
      </div>

      <h3 className="event-title">{event.title}</h3>

      <div className="event-location">
        <span>{event.location}</span>
      </div>

      <p className="event-description">{event.description}</p>

      <button
        className={`event-register-btn${event.registrationClosed ? ' event-register-btn-muted' : ''}`}
        onClick={onRegister}
        type="button"
      >
        {event.actionLabel || 'Register Now'}
      </button>
    </div>
  );
};

export default EventCard;
