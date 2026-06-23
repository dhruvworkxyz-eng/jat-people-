import React from 'react';
import {
  FaBriefcase,
  FaCalendarCheck,
  FaHandshake,
  FaIdCard,
  FaRing,
  FaTicketAlt,
  FaUsers,
  FaUtensils
} from 'react-icons/fa';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import type { MembershipPlanId } from '../utils/razorpayPayment';
import './SamelanMembership.css';

const membershipBenefits = [
  {
    icon: FaCalendarCheck,
    title: '12 Samelans in 1 Year',
    description: 'Attend one samelan every month through your yearly membership.'
  },
  {
    icon: FaUtensils,
    title: 'Dinner From Our Side',
    description: 'Your membership includes dinner arrangements during samelan gatherings.'
  },
  {
    icon: FaBriefcase,
    title: 'Business Deals',
    description: 'Meet community members for business introductions, deals, and collaboration.'
  },
  {
    icon: FaRing,
    title: 'Matrimonial Service',
    description: 'Access community-led matrimonial connections in a trusted environment.'
  },
  {
    icon: FaHandshake,
    title: 'Jobs & Opportunities',
    description: 'Discover new business, job, and growth opportunities within the network.'
  },
  {
    icon: FaUsers,
    title: 'Direct Jat Community Contacts',
    description: 'Connect directly with your own Jat community for support and networking.'
  }
];

const membershipPlans = [
  {
    planId: 'guest' as MembershipPlanId,
    label: 'Monthly Plan',
    priceLabel: 'Monthly Fee',
    price: 'Rs 1,000',
    title: '1 Month Membership',
    description: 'Best for trying one samelan and meeting the community.',
    highlights: ['1 samelan access', '1 shareable coupon', 'Dinner included'],
    buttonLabel: 'Pay Rs 1,000'
  },
  {
    planId: 'yearly' as MembershipPlanId,
    label: 'Yearly Plan',
    priceLabel: 'Annual Fee',
    price: 'Rs 12,000',
    title: '1 Year Membership',
    description: 'Best for regular community networking across the full year.',
    highlights: ['12 samelan access', '12 shareable coupons', 'Dinner included'],
    buttonLabel: 'Pay Rs 12,000'
  }
];

const SamelanMembership: React.FC = () => {
  return (
    <div className="samelan-membership">
      <Navbar />

      <section className="membership-hero">
        <div className="membership-hero-content">
          <span className="membership-eyebrow">Samelan Membership</span>
          <span className="membership-coming-soon">Coming Soon</span>
          <h1>Choose your Samelan Membership</h1>
          <p>
            Start with a 1 month membership for Rs 1,000 or take the yearly plan
            for Rs 12,000. Join samelans, enjoy dinner from our side, receive
            shareable coupons, and connect with your Jat community.
          </p>
          <button
            type="button"
            className="membership-primary-btn"
            disabled
          >
            <FaIdCard /> Coming Soon
          </button>
        </div>
      </section>

      <section className="membership-plan-section">
        <div className="membership-shell">
          <div className="membership-plan-card">
            <div>
              <span className="membership-eyebrow">Membership Plans</span>
              <h2>Pick monthly access or the full-year membership</h2>
              <p>
                Both plans include samelan access, dinner, community connections,
                and coupons that can be shared with your known contacts.
              </p>
            </div>

            <div className="membership-plan-options">
              {membershipPlans.map(plan => (
                <article className="membership-price-panel" key={plan.title}>
                  <span>{plan.priceLabel}</span>
                  <strong>{plan.price}</strong>
                  <h3>{plan.title}</h3>
                  <p>{plan.description}</p>
                  <ul>
                    {plan.highlights.map(highlight => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="membership-pay-btn"
                    disabled
                  >
                    Coming Soon
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="membership-benefits-grid">
            {membershipBenefits.map(benefit => {
              const Icon = benefit.icon;
              return (
                <article className="membership-benefit-card" key={benefit.title}>
                  <div className="membership-benefit-icon">
                    <Icon />
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="coupon-section">
        <div className="membership-shell coupon-layout">
          <div className="coupon-copy">
            <span className="membership-eyebrow">Coupon Access</span>
            <h2>Coupons for your selected plan</h2>
            <p>
              Monthly members receive 1 coupon for 1 samelan. Yearly members receive
              12 coupons for 12 samelans. Coupons can be used for your own visits and
              may also be shared with known contacts, family, or trusted community members.
            </p>
          </div>

          <div className="coupon-stack" aria-label="Membership coupon summary">
            {[1, 2, 3].map(coupon => (
              <div className="coupon-card" key={coupon}>
                <FaTicketAlt />
                <div>
                  <span>Shareable Coupon</span>
                  <strong>Samelan Pass {coupon}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SamelanMembership;
