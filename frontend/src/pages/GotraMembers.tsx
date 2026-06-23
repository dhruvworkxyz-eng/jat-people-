import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaPaperPlane, FaReply, FaTimes } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import { gotraMembers, sortedGotras } from '../data/sampleData';
import { AUTH_CHANGED_EVENT, getCurrentUser, type CurrentUser } from '../utils/authStorage';
import { getApiUrl } from '../utils/apiConfig';
import './GotraMembers.css';

const LOCAL_SIGNUPS_KEY = 'jat-people-signups';

type Member = {
  name: string;
  gotra: string;
  profile?: string;
  profession?: string;
  phoneNo?: string;
  address?: string;
  location?: string;
};

type ChatMessage = {
  id: number;
  sender: 'me' | 'member';
  text: string;
};

type SavedSignup = {
  id: string;
  name: string;
  gotra: string;
  email: string;
  createdAt: string;
  profession?: string;
  companyName?: string;
  placeType?: string;
  placeName?: string;
  city?: string;
  district?: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

const getChatStorageKey = (member: Member) => {
  const memberId = member.phoneNo || member.profile || member.name;
  return `jat-people-chat-${normalize(member.gotra)}-${normalize(memberId)}`;
};

const getDefaultMessages = (member: Member): ChatMessage[] => [
  {
    id: 1,
    sender: 'member',
    text: `Namaste, this is ${member.name}. You can send me a message here.`
  }
];

const loadSavedMessages = (member: Member) => {
  try {
    const savedMessages = window.localStorage.getItem(getChatStorageKey(member));
    if (!savedMessages) {
      return getDefaultMessages(member);
    }

    const parsedMessages = JSON.parse(savedMessages);
    if (!Array.isArray(parsedMessages)) {
      return getDefaultMessages(member);
    }

    return parsedMessages.filter(
      (message): message is ChatMessage =>
        typeof message?.id === 'number' &&
        (message.sender === 'me' || message.sender === 'member') &&
        typeof message.text === 'string'
    );
  } catch {
    return getDefaultMessages(member);
  }
};

const loadLocalSignupMembers = () => {
  try {
    const savedSignups = window.localStorage.getItem(LOCAL_SIGNUPS_KEY);
    const parsedSignups = savedSignups ? JSON.parse(savedSignups) : [];

    if (!Array.isArray(parsedSignups)) {
      return [];
    }

    return parsedSignups
      .filter((signup): signup is SavedSignup =>
        typeof signup?.name === 'string' &&
        typeof signup.gotra === 'string' &&
        typeof signup.email === 'string'
      )
      .map(signup => ({
        name: signup.name,
        gotra: signup.gotra,
        profession: signup.companyName
          ? `${signup.profession || 'Registered Member'} at ${signup.companyName}`
          : signup.profession || 'Registered Member',
        location: signup.placeName || signup.city || signup.district || 'Not provided'
      }));
  } catch {
    return [];
  }
};

const GotraMembers: React.FC = () => {
  const { gotraName = '' } = useParams();
  const selectedGotra = decodeURIComponent(gotraName);
  const knownGotra = sortedGotras.find(gotra => normalize(gotra) === normalize(selectedGotra)) || selectedGotra;
  const [enrolledMembers, setEnrolledMembers] = useState<Member[]>([]);
  const [localSignupMembers, setLocalSignupMembers] = useState<Member[]>([]);
  const [activeChatMember, setActiveChatMember] = useState<Member | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getCurrentUser());
  const canAccessMembers = Boolean(currentUser);

  useEffect(() => {
    let isMounted = true;

    fetch(getApiUrl('/api/enrollments'))
      .then(response => (response.ok ? response.json() : Promise.reject()))
      .then(data => {
        if (!isMounted || !Array.isArray(data.enrollments)) {
          return;
        }

        setEnrolledMembers(data.enrollments);
      })
      .catch(() => {
        if (isMounted) {
          setEnrolledMembers([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setLocalSignupMembers(loadLocalSignupMembers());
  }, []);

  useEffect(() => {
    const refreshCurrentUser = () => setCurrentUser(getCurrentUser());

    window.addEventListener('storage', refreshCurrentUser);
    window.addEventListener(AUTH_CHANGED_EVENT, refreshCurrentUser);

    return () => {
      window.removeEventListener('storage', refreshCurrentUser);
      window.removeEventListener(AUTH_CHANGED_EVENT, refreshCurrentUser);
    };
  }, []);

  const members = useMemo(() => {
    return [...(gotraMembers as Member[]), ...enrolledMembers, ...localSignupMembers]
      .filter(member => normalize(member.gotra || '') === normalize(knownGotra))
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [enrolledMembers, knownGotra, localSignupMembers]);

  useEffect(() => {
    if (!activeChatMember || messages.length === 0) {
      return;
    }

    window.localStorage.setItem(getChatStorageKey(activeChatMember), JSON.stringify(messages));
  }, [activeChatMember, messages]);

  const openChat = (member: Member) => {
    if (!canAccessMembers) {
      return;
    }

    setActiveChatMember(member);
    setMessages(loadSavedMessages(member));
    setChatInput('');
  };

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextMessage = chatInput.trim();
    if (!nextMessage) {
      return;
    }

    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        sender: 'me',
        text: nextMessage
      }
    ]);
    setChatInput('');
  };

  const handleMemberReply = () => {
    if (!activeChatMember) {
      return;
    }

    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        sender: 'member',
        text: `Reply from ${activeChatMember.name}: I received your message and will respond soon.`
      }
    ]);
  };

  return (
    <div className="gotra-members-page">
      <Navbar />

      {activeChatMember && (
        <aside className="chat-drawer" aria-label={`Chat with ${activeChatMember.name}`}>
          <div className="chat-header">
            <div>
              <span className="chat-kicker">Messenger</span>
              <h2>{activeChatMember.name}</h2>
              <p>{activeChatMember.gotra} gotra</p>
            </div>
            <button className="chat-icon-btn" type="button" onClick={() => setActiveChatMember(null)} aria-label="Close chat">
              <FaTimes aria-hidden="true" />
            </button>
          </div>

          <div className="chat-messages" aria-live="polite">
            {messages.map(message => (
              <div className={`chat-bubble ${message.sender === 'me' ? 'chat-bubble-me' : 'chat-bubble-member'}`} key={message.id}>
                {message.text}
              </div>
            ))}
          </div>

          <button className="member-reply-btn" type="button" onClick={handleMemberReply}>
            <FaReply aria-hidden="true" />
            Other person reply
          </button>

          <form className="chat-form" onSubmit={handleSendMessage}>
            <input
              value={chatInput}
              onChange={event => setChatInput(event.target.value)}
              placeholder="Type a message"
              aria-label="Type a message"
            />
            <button type="submit" aria-label="Send message">
              <FaPaperPlane aria-hidden="true" />
            </button>
          </form>
        </aside>
      )}

      <section className="gotra-members-hero">
        <div className="container">
          <Link className="back-link" to="/jat-gotras">Back to Gotras</Link>
          <h1>{knownGotra} Gotra</h1>
          <p className="hero-subtitle">Members listed in alphabetical order by name</p>
        </div>
      </section>

      <section className="section gotra-members-section">
        <div className="container">
          <SectionTitle
            title={`${knownGotra} Gotra`}
            subtitle={`${members.length} member${members.length === 1 ? '' : 's'} found`}
          />

          {members.length > 0 ? (
            <div className="members-list">
              {members.map(member => (
                <article className="member-row" key={`${member.name}-${member.phoneNo || member.profile || member.gotra}`}>
                  <span className="member-initial">{member.name.charAt(0).toUpperCase()}</span>
                  <div>
                    <h3 className={canAccessMembers ? '' : 'member-name-locked'}>{member.name}</h3>
                    <p>{member.profession || member.profile || 'Community Member'}</p>
                  </div>
                  {member.location && normalize(member.location) !== 'not provided' ? (
                    <span>{member.location}</span>
                  ) : member.address ? (
                    <span>{member.address}</span>
                  ) : !canAccessMembers ? (
                    <div className="member-auth-prompt">
                      <span>To chat, sign in or sign up.</span>
                      <Link to="/sign-in">Sign In</Link>
                      <Link to="/sign-up">Sign Up</Link>
                    </div>
                  ) : (
                    <button className="chat-link" type="button" onClick={() => openChat(member)}>
                      Chat
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-members">
              <h3>No members found</h3>
              <p>No {knownGotra} gotra members are listed yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GotraMembers;
