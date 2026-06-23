import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import EventCard from '../components/EventCard';
import { events } from '../data/sampleData';
import './Events.css';

const Events: React.FC = () => {
  const [registeredEvent, setRegisteredEvent] = useState<string | null>(null);
  const [hostRequested, setHostRequested] = useState(false);

  return (
    <div className="events">
      <Navbar />

      <section className="events-hero">
        <div className="container">
          <h1>Community Events</h1>
          <p className="hero-subtitle">
            Join festivals, conferences, and gatherings that celebrate our heritage
          </p>
        </div>
      </section>

      <section className="section events-section">
        <div className="container">
          <SectionTitle
            title="Events & Samelan Memories"
            subtitle="See the 22 March Jaat Samelan and stay connected with upcoming community gatherings"
          />

          {registeredEvent && (
            <div className="event-notice" role="status">
              {registeredEvent.includes('memories')
                ? 'Showing the past 22 March Jaat Samelan as a completed community event.'
                : `Registration interest saved for ${registeredEvent}. The organising team will follow up.`}
            </div>
          )}

          <div className="events-grid">
            {events.map((event, index) => (
              <EventCard
                key={index}
                event={event}
                onRegister={() => {
                  if (event.registrationClosed) {
                    setRegisteredEvent('the 22 March Jaat Samelan memories');
                    return;
                  }

                  setRegisteredEvent(event.title);
                }}
              />
            ))}
          </div>

          <div className="event-categories">
            <div className="category-card">
              <h4>Cultural Festivals</h4>
              <p>Traditional celebrations, folk performances, and heritage programs.</p>
            </div>
            <div className="category-card">
              <h4>Conferences</h4>
              <p>Community meetings, leadership summits, and strategic discussions.</p>
            </div>
            <div className="category-card">
              <h4>Sports Events</h4>
              <p>Tournaments, championships, and athletic competitions.</p>
            </div>
            <div className="category-card">
              <h4>Business Meets</h4>
              <p>Networking events, business summits, and professional gatherings.</p>
            </div>
          </div>

          <div className="host-event">
            <div className="host-card">
              <h4>Host Your Event</h4>
              <p>
                Organize community events and reach thousands of Jat community members.
                Get support for planning and promotion.
              </p>
              {hostRequested && <p className="host-confirmation">Host request noted. We will connect you with the events team.</p>}
              <button className="host-btn" onClick={() => setHostRequested(true)}>Host Event</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
