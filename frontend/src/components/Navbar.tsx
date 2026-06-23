import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaChevronDown, FaSearch, FaSignOutAlt, FaTimes, FaUser, FaUserPlus } from 'react-icons/fa';
import { AUTH_CHANGED_EVENT, clearCurrentUser, getCurrentUser, type CurrentUser } from '../utils/authStorage';
import './Navbar.css';

const ENROLLMENT_POPUP_EVENT = 'open-enrollment-popup';

type NavItem = {
  to: string;
  label: string;
  action?: 'enroll';
};

type NavGroup = {
  label: string;
  links: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Samelan',
    links: [
      { to: '/samelan-membership', label: 'Membership' },
      { to: '/samelan-membership', label: 'Enroll in Samelan', action: 'enroll' }
    ]
  },
  {
    label: 'Directory',
    links: [
      { to: '/area-wise-jat', label: 'Area Wise Jat' },
      { to: '/jat-gotras', label: 'Gotra Wise Jat' },
      { to: '/religion-wise-jat', label: 'Religion Wise Jat' },
      { to: '/profession-wise-jat', label: 'Profession Wise Jat' }
    ]
  },
  {
    label: 'Community',
    links: [
      { to: '/jat-organisation', label: 'Jat Organisations' },
      { to: '/jat-club', label: 'Jat Club' },
      { to: '/jat-book-of-world-records', label: 'Jat Book of World Records' },
      { to: '/jat-helpline', label: 'Jat Helpline' },
      { to: '/contact-us', label: 'Contact' }
    ]
  },
  {
    label: 'Media',
    links: [
      { to: '/events', label: 'Events' },
      { to: '/gallery', label: 'Gallery' }
    ]
  }
];

const primaryLinks: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about-jat', label: 'About' },
  { to: '/area-wise-jat?view=map', label: 'Jat Near Me' }
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(() => getCurrentUser());
  const navbarRef = useRef<HTMLElement>(null);
  const displayUserName = currentUser?.name || currentUser?.email || 'User';

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const refreshCurrentUser = () => {
      setCurrentUserState(getCurrentUser());
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!navbarRef.current?.contains(event.target as Node)) {
        closeMenus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('storage', refreshCurrentUser);
    window.addEventListener(AUTH_CHANGED_EVENT, refreshCurrentUser);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('storage', refreshCurrentUser);
      window.removeEventListener(AUTH_CHANGED_EVENT, refreshCurrentUser);
    };
  }, []);

  const openEnrollmentPopup = () => {
    window.dispatchEvent(new Event(ENROLLMENT_POPUP_EVENT));
  };

  const scrollToCommunitySearch = () => {
    closeMenus();

    const scrollToSection = () => {
      document.getElementById('community-search')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    };

    if (location.pathname === '/') {
      scrollToSection();
      return;
    }

    navigate('/#community-search');
    window.setTimeout(scrollToSection, 120);
  };

  const openMobileEnrollmentPopup = () => {
    openEnrollmentPopup();
    closeMenus();
  };

  const handleSignOut = () => {
    const shouldLogout = window.confirm('Do you want to logout?');
    if (!shouldLogout) {
      return;
    }

    clearCurrentUser();
    closeMenus();
  };

  const renderUserControls = () => currentUser ? (
    <>
      <span className="user-pill" title={currentUser.name || currentUser.email || currentUser.id}>
        <FaUser />
        <span>{displayUserName}</span>
      </span>
      <button type="button" className="signout-btn" onClick={handleSignOut}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </>
  ) : (
    <>
      <NavLink to="/sign-in" className={({ isActive }) => `auth-link${isActive ? ' active' : ''}`} onClick={closeMenus}>
        Sign In
      </NavLink>
      <NavLink to="/sign-up" className={({ isActive }) => `auth-btn${isActive ? ' active' : ''}`} onClick={closeMenus}>
        Sign Up
      </NavLink>
    </>
  );

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <div className="navbar-main">
          <div className="navbar-left">
            <div className="navbar-logo">
              <Link to="/" onClick={closeMenus}>
                <img className="logo-mark" src="/haryana-jat-logo.svg" alt="Jat People Haryana map logo" />
                <span className="logo-text">Jat People</span>
              </Link>
            </div>

            <div className="navbar-menu">
              {primaryLinks.map(link => (
                <NavLink
                  to={link.to}
                  key={link.to}
                  className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                  onClick={closeMenus}
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              ))}
              {navGroups.map(group => (
                <div className={`nav-dropdown${openDropdown === group.label ? ' open' : ''}`} key={group.label}>
                  <button
                    type="button"
                    className="navbar-link dropdown-trigger"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === group.label}
                    onClick={() => setOpenDropdown(current => (current === group.label ? null : group.label))}
                  >
                    {group.label} <FaChevronDown />
                  </button>
                  <div className="dropdown-menu">
                    {group.links.map(link => (
                      link.action === 'enroll' ? (
                        <button
                          type="button"
                          key={`${group.label}-${link.label}`}
                          className="dropdown-link dropdown-action"
                          onClick={() => {
                            openEnrollmentPopup();
                            closeMenus();
                          }}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <NavLink
                          to={link.to}
                          key={link.to}
                          className={({ isActive }) => `dropdown-link${isActive ? ' active' : ''}`}
                          onClick={closeMenus}
                        >
                          {link.label}
                        </NavLink>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="navbar-actions">
            <button type="button" className="search-btn" aria-label="Search" onClick={scrollToCommunitySearch}>
              <FaSearch />
            </button>
            <div className="navbar-auth-inline">
              {renderUserControls()}
            </div>
          </div>
        </div>

        {currentUser && (
          <div className="navbar-mobile-user">
            {renderUserControls()}
          </div>
        )}

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <button type="button" className="mobile-search-box" onClick={scrollToCommunitySearch}>
          <FaSearch aria-hidden="true" />
          <span>Search community</span>
        </button>

        {[...primaryLinks, ...navGroups.flatMap(group => group.links)].map(link => (
          link.action === 'enroll' ? (
            <button
              type="button"
              key={`${link.to}-${link.label}`}
              className="mobile-link mobile-action-link"
              onClick={openMobileEnrollmentPopup}
            >
              {link.label}
            </button>
          ) : (
            <NavLink
              to={link.to}
              key={`${link.to}-${link.label}`}
              className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`}
              onClick={closeMenus}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          )
        ))}
        {currentUser ? (
          <>
            <span className="mobile-link mobile-user-pill">
              <FaUser /> {displayUserName}
            </span>
            <button type="button" className="mobile-link mobile-signout-btn" onClick={handleSignOut}>
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/sign-in" className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`} onClick={closeMenus}>
              Sign In
            </NavLink>
            <NavLink to="/sign-up" className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`} onClick={closeMenus}>
              Sign Up
            </NavLink>
          </>
        )}
        <button type="button" className="mobile-link mobile-enroll-btn" onClick={openMobileEnrollmentPopup}>
          <FaUserPlus /> Enroll in Samelan
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
