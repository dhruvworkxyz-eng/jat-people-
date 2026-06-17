import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaAddressBook, FaCheck, FaGoogle, FaHandshake, FaMapMarkerAlt, FaSearch, FaUser, FaUsers } from 'react-icons/fa';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import Navbar from '../components/Navbar';
import { sortedGotras, professions, religions } from '../data/sampleData';
import { countries, getDistrictOptions, statesByCountry } from '../data/locationData';
import { setCurrentUser } from '../utils/authStorage';
import { getApiUrl } from '../utils/apiConfig';
import './Auth.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const LOCAL_SIGNUPS_KEY = 'jat-people-signups';

type SavedSignup = {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  age?: string;
  placeType?: string;
  placeName?: string;
  profession?: string;
  companyName?: string;
  nearbyLandmark?: string;
  gotra: string;
  email: string;
  createdAt: string;
};

const readSavedSignups = () => {
  try {
    const savedSignups = window.localStorage.getItem(LOCAL_SIGNUPS_KEY);
    const parsedSignups = savedSignups ? JSON.parse(savedSignups) : [];
    return Array.isArray(parsedSignups) ? (parsedSignups as SavedSignup[]) : [];
  } catch {
    return [];
  }
};

const saveSignup = (signup: SavedSignup) => {
  const savedSignups = readSavedSignups();
  const withoutSameEmail = savedSignups.filter(s => s.email.toLowerCase() !== signup.email.toLowerCase());
  window.localStorage.setItem(LOCAL_SIGNUPS_KEY, JSON.stringify([signup, ...withoutSameEmail]));
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProfileStep, setIsProfileStep] = useState(false);
  const [profileStage, setProfileStage] = useState<'benefits' | 'form' | 'complete'>('benefits');
  const [googleCredential, setGoogleCredential] = useState<string | null>(null);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  
  const [message, setMessage] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    age: '',
    placeType: '',
    placeName: '',
    nearbyLandmark: '',
    tehsil: '',
    block: '',
    district: '',
    city: '',
    state: '',
    country: '',
    religion: '',
    profession: '',
    companyName: '',
    gotra: ''
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (country: string) => {
    setProfile(prev => ({
      ...prev,
      country,
      state: '',
      district: ''
    }));
  };

  const handleStateChange = (state: string) => {
    setProfile(prev => ({
      ...prev,
      state,
      district: ''
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setMessage('Please provide your name to sign up.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.');
      return;
    }

    // Save a basic signup record and move to profile step
    const signup = {
      id: crypto.randomUUID(),
      name: name.trim(),
      gotra: '',
      email: email.trim(),
      createdAt: new Date().toISOString()
    };

    saveSignup(signup);
    setCurrentUser({
      id: signup.id,
      name: signup.name,
      email: signup.email
    });

    setPassword('');
    setConfirmPassword('');
    setMessage(null);
    setProfileStage('benefits');
    setIsProfileStep(true);
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setMessage('Google did not return a valid sign up credential. Please try again.');
      return;
    }

    setGoogleCredential(credentialResponse.credential);

    // Create a basic record and move to profile step
    const signup = {
      id: crypto.randomUUID(),
      name: name.trim() || 'Google user',
      gotra: '',
      email: email.trim(),
      createdAt: new Date().toISOString()
    };

    saveSignup(signup);
    setCurrentUser({
      id: signup.id,
      name: signup.name,
      email: signup.email
    });

    setMessage(null);
    setProfileStage('benefits');
    setIsProfileStep(true);
  };

  const handleGoogleError = () => {
    setMessage('Google sign up failed. Please try again.');
  };

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProfileSubmitting(true);
    setMessage(null);

    try {
      const saved = readSavedSignups();
      const latest = saved[0];
      const fullName = [profile.firstName, profile.middleName, profile.surname]
        .map(part => part.trim())
        .filter(Boolean)
        .join(' ');
      const enriched = {
        ...latest,
        name: fullName || latest?.name || name,
        firstName: profile.firstName.trim(),
        middleName: profile.middleName.trim(),
        surname: profile.surname.trim(),
        age: profile.age,
        placeType: profile.placeType,
        placeName: profile.placeName.trim(),
        nearbyLandmark: profile.nearbyLandmark.trim(),
        area: profile.state,
        tehsil: profile.tehsil,
        block: profile.block,
        district: profile.district.trim(),
        city: profile.city,
        state: profile.state.trim(),
        country: profile.country,
        religion: profile.religion,
        profession: profile.profession,
        companyName: profile.companyName.trim(),
        gotra: profile.gotra || latest?.gotra || ''
      };

      const finalProfile: Record<string, string> = { ...enriched };
      finalProfile.id = finalProfile.id || crypto.randomUUID();
      finalProfile.name = finalProfile.name || latest?.name || name;
      finalProfile.gotra = finalProfile.gotra || '';
      finalProfile.email = finalProfile.email || email;
      finalProfile.createdAt = finalProfile.createdAt || new Date().toISOString();

      saveSignup(finalProfile as SavedSignup & Record<string, string>);
      setCurrentUser({
        id: finalProfile.id,
        name: finalProfile.name,
        email: finalProfile.email
      });

      if (googleCredential) {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 8000);

        const response = await fetch(getApiUrl('/api/auth/google-signup'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
            credential: googleCredential,
            gotra: finalProfile.gotra,
            name: finalProfile.name
          })
        });
        window.clearTimeout(timeoutId);

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || 'Google account could not be saved on backend.');
        }

        if (result.user?.id) {
          setCurrentUser({
            id: result.user.id,
            name: finalProfile.name,
            email: result.user.email,
            picture: result.user.picture
          });
        }
      }

      setMessage('Welcome to Jat People - profile saved.');
    } catch (error) {
      console.warn('Profile backend sync warning:', error);
      setMessage('Profile saved on this device. Backend sync can be retried after deployment settings are fixed.');
    } finally {
      setIsProfileSubmitting(false);
      setProfileStage('complete');
    }
  };

  const stateOptions = statesByCountry[profile.country] || [];
  const districtOptions = profile.state ? getDistrictOptions(profile.state) : [];

  return (
    <div className={`auth-page${isProfileStep ? ' profile-step-active' : ''}`}>
      <Navbar />
      <main className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <span className="eyebrow">New member registration</span>
            <h1>Sign Up</h1>
            <p>Fill in your name and contact details. You'll be prompted to complete profile after sign up.</p>
          </div>

          {!isProfileStep && (
            <>
              {googleClientId ? (
                <div className="google-login-wrap">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signup_with"
                    shape="pill"
                    theme="outline"
                    width="100%"
                  />
                </div>
              ) : (
                <button type="button" className="google-signin-btn" onClick={() => setMessage('Add VITE_GOOGLE_CLIENT_ID in frontend .env to enable Google sign up.') }>
                  <FaGoogle />
                  <span>Sign up with Google</span>
                </button>
              )}

              <div className="auth-divider">
                <span>or</span>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <label className="auth-field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    className="auth-input"
                    required
                  />
                </label>

                <label className="auth-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="auth-input"
                    required
                  />
                </label>

                <label className="auth-field">
                  <span>Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Choose a password"
                    className="auth-input"
                    required
                  />
                </label>

                <label className="auth-field">
                  <span>Confirm Password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter password again"
                    className="auth-input"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <button type="submit" className="auth-submit">
                  Sign Up
                </button>
              </form>
            </>
          )}

          {!isProfileStep && (
            <p className="auth-meta">
              Already have an account? <Link to="/sign-in">Sign in here</Link>.
            </p>
          )}

          {!isProfileStep && message && <p className="auth-message">{message}</p>}
          {!isProfileStep && message && message.includes('Welcome to Jat People') && (
            <div className="post-signup-links">
              <p>Explore listings:</p>
              <ul>
                <li><Link to="/area-wise-jat">Area wise</Link></li>
                <li><Link to="/religion-wise-jat">Religion wise</Link></li>
                <li><Link to="/jat-gotras">Gotra wise</Link></li>
                <li><Link to="/profession-wise-jat">Profession wise</Link></li>
              </ul>
            </div>
          )}
        </div>
      </main>

      {isProfileStep && (
        <div className="profile-overlay" role="dialog" aria-modal="true" aria-labelledby="profile-welcome-title">
          <div className="profile-modal">
            {profileStage === 'benefits' && (
              <div className="profile-benefits">
                <header className="profile-welcome">
                  <div className="profile-welcome-icon" aria-hidden="true">
                    <FaCheck />
                  </div>
                  <div>
                    <span className="profile-kicker">Your account is ready</span>
                    <h1 id="profile-welcome-title">Welcome to Jat People</h1>
                    <p>Complete your profile to get your name listed in the community directory for free.</p>
                  </div>
                </header>

                <div className="benefit-grid">
                  <article>
                    <FaAddressBook aria-hidden="true" />
                    <h2>Free directory listing</h2>
                    <p>Your name can appear in our community directories without any charge.</p>
                  </article>
                  <article>
                    <FaSearch aria-hidden="true" />
                    <h2>Easy to discover</h2>
                    <p>Members can find you by area, religion, profession, and gotra.</p>
                  </article>
                  <article>
                    <FaHandshake aria-hidden="true" />
                    <h2>Build connections</h2>
                    <p>Meet people who share your location, heritage, and professional interests.</p>
                  </article>
                </div>

                <div className="profile-actions benefits-action">
                  <span>It only takes a few minutes.</span>
                  <button type="button" className="auth-submit" onClick={() => setProfileStage('form')}>
                    Fill My Details
                  </button>
                </div>
              </div>
            )}

            {profileStage === 'form' && (
              <>
            <header className="profile-welcome">
              <div className="profile-welcome-icon" aria-hidden="true">
                <FaCheck />
              </div>
              <div>
                <span className="profile-kicker">Account created successfully</span>
                <h1 id="profile-welcome-title">Welcome to Jat People</h1>
                <p>Tell us a little about yourself to complete your community profile.</p>
              </div>
            </header>

            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <section className="profile-section">
                <div className="profile-section-heading">
                  <FaUser aria-hidden="true" />
                  <div>
                    <h2>Personal details</h2>
                    <p>Your name and basic information</p>
                  </div>
                </div>
                <div className="profile-field-grid">
              <label className="auth-field">
                <span>First Name</span>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label className="auth-field">
                <span>Middle Name</span>
                <input
                  type="text"
                  value={profile.middleName}
                  onChange={(e) => handleProfileChange('middleName', e.target.value)}
                  placeholder="Middle name (optional)"
                  autoComplete="additional-name"
                />
              </label>

              <label className="auth-field">
                <span>Surname</span>
                <input
                  type="text"
                  value={profile.surname}
                  onChange={(e) => handleProfileChange('surname', e.target.value)}
                  placeholder="Surname"
                  autoComplete="family-name"
                  required
                />
              </label>

              <label className="auth-field">
                <span>Age</span>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleProfileChange('age', e.target.value)}
                  placeholder="Age"
                  min="18"
                  max="120"
                  inputMode="numeric"
                  required
                />
              </label>
                </div>
              </section>

              <section className="profile-section">
                <div className="profile-section-heading">
                  <FaMapMarkerAlt aria-hidden="true" />
                  <div>
                    <h2>Location</h2>
                    <p>Help members find people in their region</p>
                  </div>
                </div>
                <div className="profile-field-grid">
              <label className="auth-field">
                <span>Country</span>
                <select value={profile.country} onChange={(e) => handleCountryChange(e.target.value)} required>
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </label>

              <label className="auth-field">
                <span>State</span>
                <select
                  value={profile.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  disabled={!profile.country}
                  required
                >
                  <option value="">{profile.country ? 'Select state' : 'Select country first'}</option>
                  {stateOptions.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </label>

              <label className="auth-field">
                <span>District</span>
                <select
                  value={profile.district}
                  onChange={(e) => handleProfileChange('district', e.target.value)}
                  disabled={!profile.state}
                  required
                >
                  <option value="">{profile.state ? 'Select district' : 'Select state first'}</option>
                  {districtOptions.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </label>

              <label className="auth-field">
                <span>Location Type</span>
                <select
                  value={profile.placeType}
                  onChange={(e) => {
                    handleProfileChange('placeType', e.target.value);
                    handleProfileChange('placeName', '');
                  }}
                  required
                >
                  <option value="">Select town or village</option>
                  <option value="Town">Town</option>
                  <option value="Village">Village</option>
                </select>
              </label>

              {profile.placeType && (
                <label className="auth-field">
                  <span>{profile.placeType} Name</span>
                  <input
                    type="text"
                    value={profile.placeName}
                    onChange={(e) => handleProfileChange('placeName', e.target.value)}
                    placeholder={`Enter ${profile.placeType.toLowerCase()} name`}
                    required
                  />
                </label>
              )}

              <label className="auth-field">
                <span>Nearby Landmark</span>
                <input
                  type="text"
                  value={profile.nearbyLandmark}
                  onChange={(e) => handleProfileChange('nearbyLandmark', e.target.value)}
                  placeholder="School, temple, market, road..."
                />
              </label>

              <label className="auth-field">
                <span>Tehsil</span>
                <input type="text" value={profile.tehsil} onChange={(e) => handleProfileChange('tehsil', e.target.value)} placeholder="Tehsil" />
              </label>

              <label className="auth-field">
                <span>Block</span>
                <input type="text" value={profile.block} onChange={(e) => handleProfileChange('block', e.target.value)} placeholder="Block" />
              </label>

              <label className="auth-field">
                <span>City</span>
                <input type="text" value={profile.city} onChange={(e) => handleProfileChange('city', e.target.value)} placeholder="City" />
              </label>
                </div>
              </section>

              <section className="profile-section">
                <div className="profile-section-heading">
                  <FaUsers aria-hidden="true" />
                  <div>
                    <h2>Community details</h2>
                    <p>Connect through shared identity and work</p>
                  </div>
                </div>
                <div className="profile-field-grid">
              <label className="auth-field">
                <span>Religion</span>
                <select value={profile.religion} onChange={(e) => handleProfileChange('religion', e.target.value)} required>
                  <option value="">Select religion</option>
                  {religions.map(r => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </label>

              <label className="auth-field">
                <span>Profession</span>
                <select
                  value={profile.profession}
                  onChange={(e) => {
                    handleProfileChange('profession', e.target.value);
                    handleProfileChange('companyName', '');
                  }}
                  required
                >
                  <option value="">Select profession</option>
                  {professions.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </label>

              {profile.profession && (
                <label className="auth-field">
                  <span>Company / Organisation Name</span>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => handleProfileChange('companyName', e.target.value)}
                    placeholder="Where do you work?"
                    required
                  />
                </label>
              )}

              <label className="auth-field">
                <span>Gotra</span>
                <input type="text" list="gotra-options" value={profile.gotra} onChange={(e) => handleProfileChange('gotra', e.target.value)} placeholder="Search or enter gotra" required />
                <datalist id="gotra-options">
                  {sortedGotras.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </datalist>
              </label>
                </div>
              </section>

              <div className="profile-actions">
                <span>Your information can be updated later.</span>
                <button type="submit" className="auth-submit">
                  {isProfileSubmitting ? 'Saving Profile...' : 'Complete Profile'}
                </button>
              </div>
            </form>
              </>
            )}

            {profileStage === 'complete' && (
              <div className="profile-complete">
                <div className="profile-complete-icon" aria-hidden="true">
                  <FaCheck />
                </div>
                <span className="profile-kicker">Registration complete</span>
                <h1 id="profile-welcome-title">Thank you for registering with us</h1>
                <p>Your profile is saved and your name has been added to the Jat People community directories.</p>
                <div className="completion-links">
                  <Link to="/area-wise-jat">Explore Area Directory</Link>
                  <button
                    type="button"
                    onClick={() => navigate('/', {
                      state: {
                        directoryMessage: 'Your info has been stored in the Directory. Open Directory to find your profile.'
                      },
                      replace: true
                    })}
                  >
                    Continue to Website
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
