import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { FaBriefcase, FaGlobeAsia, FaMapMarkerAlt, FaPhoneAlt, FaTimes, FaUser, FaUsers } from 'react-icons/fa';
import samelanVideo from '../assets/jaat samaj samelan ad 4.mp4';
import { professions, religions, sortedGotras } from '../data/sampleData';
import { getApiUrl } from '../utils/apiConfig';
import './EnrollmentPopup.css';

type EnrollmentForm = {
  name: string;
  gotra: string;
  religion: string;
  profession: string;
  phoneNo: string;
  address: string;
};

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const ENROLLMENT_POPUP_EVENT = 'open-enrollment-popup';

const initialForm: EnrollmentForm = {
  name: '',
  gotra: '',
  religion: '',
  profession: '',
  phoneNo: '',
  address: ''
};

const EnrollmentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');

  const openPopup = useCallback(() => {
    setSubmitState('idle');
    setMessage('');
    setIsOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener(ENROLLMENT_POPUP_EVENT, openPopup);

    return () => {
      window.removeEventListener(ENROLLMENT_POPUP_EVENT, openPopup);
    };
  }, [openPopup]);

  const handleChange =
    (field: keyof EnrollmentForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prevForm => ({
        ...prevForm,
        [field]: event.target.value
      }));
    };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState('submitting');
    setMessage('');

    try {
      const response = await fetch(getApiUrl('/api/enrollments'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Unable to submit enrollment right now.');
      }

      setForm(initialForm);
      setSubmitState('success');
      setMessage(result.message || 'Enrollment submitted successfully.');
      window.setTimeout(() => setIsOpen(false), 1400);
    } catch (error) {
      setSubmitState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to submit enrollment right now.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="enrollment-overlay" role="presentation">
      <section className="enrollment-popup" role="dialog" aria-modal="true" aria-labelledby="enrollment-title">
        <button className="enrollment-close" type="button" onClick={closePopup} aria-label="Close enrollment popup">
          <FaTimes />
        </button>

        <div className="enrollment-layout">
          <div className="enrollment-video-panel">
            <video
              className="enrollment-video"
              src={samelanVideo}
              autoPlay
              muted
              loop
              playsInline
              controls
              aria-label="Jaat Samelan enrollment video"
            />
          </div>

          <div className="enrollment-details">
            <div className="enrollment-header">
              <span>Community Enrollment</span>
              <h2 id="enrollment-title">Enroll yourself on Jaat Samelan</h2>
              <p>Share your details to register for the samelan.</p>
            </div>

            <form className="enrollment-form" onSubmit={handleSubmit}>
              <label>
                <span>Name</span>
                <div className="enrollment-field">
                  <FaUser />
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Enter full name"
                    required
                    maxLength={120}
                  />
                </div>
              </label>

              <label>
                <span>Profession</span>
                <div className="enrollment-field">
                  <FaBriefcase />
                  <select
                    value={form.profession}
                    onChange={handleChange('profession')}
                    required
                  >
                    <option value="">Select profession</option>
                    {professions.map(profession => (
                      <option key={profession.name} value={profession.name}>
                        {profession.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label>
                <span>Gotra</span>
                <div className="enrollment-field">
                  <FaUsers />
                  <input
                    type="text"
                    list="gotra-options"
                    value={form.gotra}
                    onChange={handleChange('gotra')}
                    placeholder="Search or enter gotra"
                    required
                    maxLength={120}
                  />
                  <datalist id="gotra-options">
                    {sortedGotras.map(gotra => (
                      <option key={gotra} value={gotra}>
                        {gotra}
                      </option>
                    ))}
                  </datalist>
                </div>
              </label>

              <label>
                <span>Religion</span>
                <div className="enrollment-field">
                  <FaGlobeAsia />
                  <select
                    value={form.religion}
                    onChange={handleChange('religion')}
                    required
                  >
                    <option value="">Select religion</option>
                    {religions.map(religion => (
                      <option key={religion.name} value={religion.name}>
                        {religion.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label>
                <span>Phone No.</span>
                <div className="enrollment-field">
                  <FaPhoneAlt />
                  <input
                    type="tel"
                    value={form.phoneNo}
                    onChange={handleChange('phoneNo')}
                    placeholder="Enter phone number"
                    required
                    maxLength={30}
                  />
                </div>
              </label>

              <label>
                <span>Address</span>
                <div className="enrollment-field enrollment-address-field">
                  <FaMapMarkerAlt />
                  <textarea
                    value={form.address}
                    onChange={handleChange('address')}
                    placeholder="Enter address"
                    required
                    maxLength={500}
                    rows={3}
                  />
                </div>
              </label>

              {message && <p className={`enrollment-message enrollment-message-${submitState}`}>{message}</p>}

              <button className="enrollment-submit" type="submit" disabled={submitState === 'submitting'}>
                {submitState === 'submitting' ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnrollmentPopup;
