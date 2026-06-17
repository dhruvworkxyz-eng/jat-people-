import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBuilding,
  FaCalendarAlt,
  FaCameraRetro,
  FaCheck,
  FaFilter,
  FaGem,
  FaHandsHelping,
  FaMapMarkedAlt,
  FaSearch,
  FaShieldAlt,
  FaSitemap,
  FaTicketAlt,
  FaTimes,
  FaUsers,
  FaUserTie
} from 'react-icons/fa';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import EventImageMarquee from '../components/EventImageMarquee';
import Footer from '../components/Footer';
import { areas, events, gotraMembers, professionMembers, professions, religions } from '../data/sampleData';
import { startRazorpayPayment, type MembershipPlanId } from '../utils/razorpayPayment';
import './Home.css';

const ENROLLMENT_POPUP_EVENT = 'open-enrollment-popup';
const LOCAL_SIGNUPS_KEY = 'jat-people-signups';

const portalFeatures = [
  { title: 'Area Wise Jat', description: 'Explore regional communities, heartlands, and diaspora presence.', link: '/area-wise-jat', icon: FaMapMarkedAlt },
  { title: 'Gotra Wise Jat', description: 'Browse gotras with clean search and discovery flows.', link: '/jat-gotras', icon: FaSitemap },
  { title: 'Religion Wise Jat', description: 'Understand community diversity across faith traditions.', link: '/religion-wise-jat', icon: FaShieldAlt },
  { title: 'Profession Wise Jat', description: 'Find professional networks across farming, defence, business, and more.', link: '/profession-wise-jat', icon: FaUserTie },
  { title: 'Jat Organisations', description: 'Discover associations, federations, and regional leadership bodies.', link: '/jat-organisation', icon: FaBuilding },
  { title: 'Jat Club', description: 'Join clubs for youth, culture, business, and sports networking.', link: '/jat-club', icon: FaUsers },
  { title: 'Jat Helpline', description: 'Access community support, guidance, and emergency contact pathways.', link: '/jat-helpline', icon: FaHandsHelping },
  { title: 'Events', description: 'Stay connected through conferences, summits, and cultural programs.', link: '/events', icon: FaCalendarAlt },
  { title: 'Gallery', description: 'Experience a premium visual archive of culture and community life.', link: '/gallery', icon: FaCameraRetro }
];

const counters = [
  { value: '5000+', label: 'Community Members' },
  { value: '1000+', label: 'Gotras Listed' },
  { value: '100+', label: 'Organisations' },
  { value: '24/7', label: 'Helpline Support' }
];

const membershipPlans = [
  {
    planId: 'yearly' as MembershipPlanId,
    badge: 'Exclusive',
    icon: FaGem,
    title: 'Exclusive Membership',
    price: 'Rs 12,000',
    period: '/year',
    subtitle: 'Full year access - All samelan benefits',
    buttonLabel: 'Join Now',
    featured: true,
    benefits: [
      { label: '12 samelans across the year', included: true },
      { label: '12 shareable samelan coupons', included: true },
      { label: 'Dinner from our side', included: true },
      { label: 'Exclusive direct deal opportunities', included: true },
      { label: 'Business, job, and opportunity network', included: true },
      { label: 'Matrimonial service access', included: true },
      { label: 'Direct access to Jat community contacts', included: true },
      { label: 'Priority member support', included: true }
    ]
  },
  {
    planId: 'guest' as MembershipPlanId,
    icon: FaTicketAlt,
    title: 'Guest Entry',
    price: 'Rs 1,000',
    period: '',
    subtitle: 'Coupon based - Per samelan entry',
    buttonLabel: 'Get Guest Entry',
    featured: false,
    benefits: [
      { label: 'Attend 1 samelan', included: true },
      { label: '1 shareable samelan coupon', included: true },
      { label: 'Dinner from our side', included: true },
      { label: 'Meet and network with members', included: true },
      { label: 'Explore direct deal opportunities', included: true },
      { label: 'Year-round samelan access', included: false },
      { label: '12 coupons for the full year', included: false },
      { label: 'Priority member support', included: false }
    ]
  }
];

type CommunitySearchResult = {
  id: string;
  name: string;
  gotra?: string;
  area?: string;
  religion?: string;
  profession?: string;
  description: string;
  link: string;
};

const normalize = (value = '') => value.trim().toLowerCase();

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [payingPlanId, setPayingPlanId] = useState<MembershipPlanId | null>(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [directoryMessage, setDirectoryMessage] = useState('');
  const [filters, setFilters] = useState({
    gotra: '',
    area: '',
    religion: '',
    profession: ''
  });

  const filterSummary = useMemo(() => {
    const active = Object.values(filters).filter(Boolean).length;
    return active ? `${active} active filter${active > 1 ? 's' : ''}` : 'Start exploring';
  }, [filters]);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some(value => Boolean(value.trim())),
    [filters]
  );

  useEffect(() => {
    const state = location.state as { welcomeMessage?: string; directoryMessage?: string } | null;

    if (!state?.welcomeMessage && !state?.directoryMessage) {
      return;
    }

    if (state.welcomeMessage) {
      setWelcomeMessage(state.welcomeMessage);
    }

    if (state.directoryMessage) {
      setDirectoryMessage(state.directoryMessage);
    }

    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  const communityResults = useMemo<CommunitySearchResult[]>(() => {
    let savedProfiles: CommunitySearchResult[] = [];

    try {
      const parsed = JSON.parse(window.localStorage.getItem(LOCAL_SIGNUPS_KEY) || '[]');
      if (Array.isArray(parsed)) {
        savedProfiles = parsed.map((profile, index) => ({
          id: `signup-${profile.id || index}`,
          name: profile.name || [profile.firstName, profile.middleName, profile.surname].filter(Boolean).join(' ') || 'Registered member',
          gotra: profile.gotra || '',
          area: [profile.placeName, profile.city, profile.district, profile.state, profile.country].filter(Boolean).join(', '),
          religion: profile.religion || '',
          profession: profile.profession || '',
          description: profile.profession
            ? `${profile.profession}${profile.companyName ? ` at ${profile.companyName}` : ''}`
            : 'Registered community profile',
          link: '/area-wise-jat'
        }));
      }
    } catch {
      savedProfiles = [];
    }

    const sampleResults: CommunitySearchResult[] = [
      ...gotraMembers.map(member => ({
        id: `gotra-${member.name}-${member.gotra}`,
        name: member.name,
        gotra: member.gotra,
        profession: member.profession,
        area: member.location,
        description: member.profile,
        link: `/jat-gotras/${encodeURIComponent(member.gotra)}`
      })),
      ...professionMembers.map(member => ({
        id: `profession-${member.name}-${member.profession}`,
        name: member.name,
        gotra: member.gotra,
        profession: member.profession,
        area: member.location,
        description: member.role,
        link: `/profession-wise-jat/${encodeURIComponent(member.profession)}`
      })),
      ...religions.flatMap(religion =>
        ('members' in religion && Array.isArray(religion.members) ? religion.members : []).map(member => ({
          id: `religion-${religion.name}-${member.name}`,
          name: member.name,
          gotra: member.gotra,
          religion: religion.name,
          description: member.profile || `${religion.name} member`,
          link: `/religion-wise-jat/${encodeURIComponent(religion.name)}`
        }))
      )
    ];

    const allResults = [...savedProfiles, ...sampleResults];
    const gotraQuery = normalize(filters.gotra);
    const areaQuery = normalize(filters.area);
    const religionQuery = normalize(filters.religion);
    const professionQuery = normalize(filters.profession);

    if (!hasActiveFilters) {
      return [];
    }

    return allResults.filter(result => {
      const matches = [
        gotraQuery && (normalize(result.gotra).includes(gotraQuery) || normalize(result.name).includes(gotraQuery)),
        areaQuery && normalize(result.area).includes(areaQuery),
        religionQuery && normalize(result.religion).includes(religionQuery),
        professionQuery && normalize(result.profession).includes(professionQuery)
      ];

      return matches.some(Boolean);
    });
  }, [filters, hasActiveFilters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const openEnrollmentPopup = () => {
    window.dispatchEvent(new Event(ENROLLMENT_POPUP_EVENT));
  };

  const handleMembershipPayment = async (planId: MembershipPlanId) => {
    setPayingPlanId(planId);
    setPaymentMessage('');

    try {
      await startRazorpayPayment(planId);
      setPaymentMessage('Payment successful. Please complete your enrollment details.');
      openEnrollmentPopup();
    } catch (error) {
      setPaymentMessage(error instanceof Error ? error.message : 'Unable to complete Razorpay payment.');
    } finally {
      setPayingPlanId(null);
    }
  };

  return (
    <div className="home premium-home">
      <Navbar />
      <Hero />
      {welcomeMessage && (
        <div className="home-welcome-toast" role="status" aria-live="polite">
          <span>{welcomeMessage}</span>
          <button type="button" aria-label="Dismiss welcome message" onClick={() => setWelcomeMessage('')}>
            <FaTimes />
          </button>
        </div>
      )}
      {directoryMessage && (
        <div className="home-welcome-toast home-directory-toast" role="status" aria-live="polite">
          <span>{directoryMessage}</span>
          <Link to="/area-wise-jat">Directory</Link>
          <button type="button" aria-label="Dismiss directory message" onClick={() => setDirectoryMessage('')}>
            <FaTimes />
          </button>
        </div>
      )}
      <EventImageMarquee />

      <section className="counter-band" aria-label="Community statistics">
        <div className="counter-grid">
          {counters.map(counter => (
            <div className="counter-card" key={counter.label}>
              <span>{counter.value}</span>
              <p>{counter.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="portal-section">
        <div className="portal-shell">
          <div className="section-heading">
            <span className="eyebrow">Premium Community Portal</span>
            <h2>Explore every part of the Jat People network</h2>
            <p>Fast pathways into gotras, regions, events, organisations, clubs, gallery, and helpline support.</p>
          </div>

          <div className="portal-feature-grid">
            {portalFeatures.map(feature => {
              const Icon = feature.icon;
              return (
                <Link className="portal-card tilt-card" to={feature.link} key={feature.title}>
                  <span className="portal-card-glow"></span>
                  <div className="portal-icon"><Icon /></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <span className="portal-card-link">Open section</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="search-console-section" id="community-search">
        <div className="portal-shell">
          <div className="search-console">
            <div className="search-console-copy">
              <span className="eyebrow">Smart Discovery</span>
              <h2>Search and filter the community</h2>
              <p>Use the backend-ready filter structure for gotras, area, religion, and profession discovery.</p>
              <div className="filter-status">
                <FaFilter />
                <span>{filterSummary}</span>
              </div>
            </div>
            <div className="search-grid">
              <label>
                <span>Search Gotra</span>
                <div><FaSearch /><input value={filters.gotra} onChange={e => handleFilterChange('gotra', e.target.value)} placeholder="Dhillon, Gill, Chahal..." /></div>
              </label>
              <label>
                <span>Search by Area</span>
                <select value={filters.area} onChange={e => handleFilterChange('area', e.target.value)}>
                  <option value="">All areas</option>
                  {areas.map(area => <option key={area.name}>{area.name}</option>)}
                </select>
              </label>
              <label>
                <span>Search by Religion</span>
                <select value={filters.religion} onChange={e => handleFilterChange('religion', e.target.value)}>
                  <option value="">All communities</option>
                  {religions.map(religion => <option key={religion.name}>{religion.name}</option>)}
                </select>
              </label>
              <label>
                <span>Search by Profession</span>
                <select value={filters.profession} onChange={e => handleFilterChange('profession', e.target.value)}>
                  <option value="">All professions</option>
                  {professions.map(profession => <option key={profession.name}>{profession.name}</option>)}
                </select>
              </label>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="home-search-results" aria-live="polite">
              <div className="home-search-results-heading">
                <span>{communityResults.length} result{communityResults.length === 1 ? '' : 's'} found</span>
                <button
                  type="button"
                  onClick={() => setFilters({ gotra: '', area: '', religion: '', profession: '' })}
                >
                  Clear filters
                </button>
              </div>

              {communityResults.length > 0 ? (
                <div className="home-search-results-grid">
                  {communityResults.map(result => (
                    <Link className="home-search-result-card" to={result.link} key={result.id}>
                      <span className="home-search-avatar">{result.name.charAt(0).toUpperCase()}</span>
                      <div>
                        <h3>{result.name}</h3>
                        <p>{result.description}</p>
                        <dl>
                          {result.gotra && <><dt>Gotra</dt><dd>{result.gotra}</dd></>}
                          {result.area && <><dt>Area</dt><dd>{result.area}</dd></>}
                          {result.religion && <><dt>Religion</dt><dd>{result.religion}</dd></>}
                          {result.profession && <><dt>Profession</dt><dd>{result.profession}</dd></>}
                        </dl>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="home-search-empty">
                  <h3>No matching community profiles found</h3>
                  <p>Try fewer filters or complete a member profile so it appears in search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="home-helpline-strip">
        <div className="portal-shell home-helpline-card">
          <div>
            <span className="eyebrow">Jat Helpline</span>
            <h2>Need help from the community?</h2>
            <p>Legal, medical, business, family, and urgent support pathways in one place.</p>
          </div>
          <Link to="/jat-helpline" className="home-helpline-link">
            <FaHandsHelping />
            Contact Helpline
          </Link>
        </div>
      </section>

      <section className="events-preview premium-events">
        <div className="portal-shell">
          <div className="section-heading">
            <span className="eyebrow">Events & Samelan</span>
            <h2>Gatherings and memories that keep the network active</h2>
          </div>
          <div className="events-grid">
            {events.slice(0, 3).map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-membership-section">
        <div className="portal-shell">
          <div className="home-membership-heading">
            <span>Membership Plans</span>
          </div>

          <div className="home-membership-grid">
            {membershipPlans.map(plan => {
              const Icon = plan.icon;
              const isPaymentStarting = payingPlanId === plan.planId;
              return (
                <article className={`home-membership-card ${plan.featured ? 'featured' : ''}`} key={plan.title}>
                  {plan.badge && <span className="home-plan-badge">{plan.badge}</span>}
                  <Icon className="home-plan-icon" />
                  <h2>{plan.title}</h2>
                  <div className="home-plan-price">
                    <strong>{plan.price}</strong>
                    {plan.period && <span>{plan.period}</span>}
                  </div>
                  <p>{plan.subtitle}</p>
                  <span className="home-plan-divider"></span>

                  <ul className="home-plan-benefits">
                    {plan.benefits.map(benefit => (
                      <li className={benefit.included ? '' : 'muted'} key={benefit.label}>
                        {benefit.included ? <FaCheck /> : <FaTimes />}
                        <span>{benefit.label}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="home-plan-button"
                    onClick={() => handleMembershipPayment(plan.planId)}
                    disabled={isPaymentStarting}
                  >
                    {isPaymentStarting ? 'Opening Razorpay...' : plan.buttonLabel}
                  </button>
                </article>
              );
            })}
          </div>

          {paymentMessage && <p className="home-payment-message">{paymentMessage}</p>}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
