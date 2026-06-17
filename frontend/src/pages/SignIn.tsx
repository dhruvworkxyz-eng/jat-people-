import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import Navbar from '../components/Navbar';
import { setCurrentUser } from '../utils/authStorage';
import { getApiUrl } from '../utils/apiConfig';
import './Auth.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const LOCAL_SIGNUPS_KEY = 'jat-people-signups';

type SavedSignup = {
  id?: string;
  name: string;
  email: string;
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

const saveSignups = (signups: SavedSignup[]) => {
  window.localStorage.setItem(LOCAL_SIGNUPS_KEY, JSON.stringify(signups));
};

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const savedSignups = readSavedSignups();
    const savedUser = savedSignups.find(signup => signup.email.toLowerCase() === email.trim().toLowerCase());

    if (!savedUser) {
      setMessage('No local account found for this email. Please sign up first.');
      return;
    }

    const userId = savedUser.id || crypto.randomUUID();
    if (!savedUser.id) {
      saveSignups(savedSignups.map(signup =>
        signup.email.toLowerCase() === savedUser.email.toLowerCase()
          ? { ...signup, id: userId }
          : signup
      ));
    }

    setCurrentUser({
      id: userId,
      name: savedUser.name,
      email: savedUser.email
    });
    setPassword('');
    navigate('/', {
      state: {
        welcomeMessage: `Welcome, ${savedUser.name}.`
      },
      replace: true
    });
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setMessage('Google did not return a valid sign in credential. Please try again.');
      return;
    }

    setIsGoogleSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(getApiUrl('/api/auth/google-signin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credential: credentialResponse.credential
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Google sign in failed. Please try again.');
      }

      if (result.user?.id) {
        setCurrentUser({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          picture: result.user.picture
        });
      }

      const signedInName = result.user?.name || result.user?.email || 'User';
      navigate('/', {
        state: {
          welcomeMessage: `Welcome, ${signedInName}.`
        },
        replace: true
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Google sign in failed. Please try again.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setMessage('Google sign in failed. Please try again.');
  };

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <span className="eyebrow">Member access</span>
            <h1>Sign In</h1>
            <p>Use your email or mobile number to sign in to the Jat People portal.</p>
          </div>

          {googleClientId ? (
            <div className="google-login-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                shape="pill"
                theme="outline"
                width="100%"
                useOneTap={false}
              />
            </div>
          ) : (
            <button type="button" className="google-signin-btn" onClick={() => setMessage('Add VITE_GOOGLE_CLIENT_ID in frontend .env to enable Google sign in.')}>
              <FaGoogle />
              <span>Continue with Google</span>
            </button>
          )}
          {isGoogleSubmitting && <p className="auth-message">Signing in with Google...</p>}

          <div className="auth-divider">
            <span>or</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email or mobile</span>
              <input
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email or mobile"
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
                placeholder="Enter your password"
                className="auth-input"
                required
              />
            </label>

            <button type="submit" className="auth-submit">
              Sign In
            </button>
          </form>

          <p className="auth-meta">
            Don't have an account? <Link to="/sign-up">Create one now</Link>.
          </p>
          {message && <p className="auth-message">{message}</p>}
        </div>
      </main>
    </div>
  );
};

export default SignIn;
