import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaPaperPlane, FaReply, FaTimes } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import SearchBar from '../components/SearchBar';
import { religions } from '../data/sampleData';
import { AUTH_CHANGED_EVENT, getCurrentUser, type CurrentUser } from '../utils/authStorage';
import './GotraMembers.css';

const LOCAL_SIGNUPS_KEY = 'jat-people-signups';

type ReligionMember = {
  name: string;
  gotra: string;
  profile?: string;
  religion: string;
};

type ChatMessage = {
  id: number;
  sender: 'me' | 'member';
  text: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

const getChatStorageKey = (member: ReligionMember) =>
  `jat-people-religion-chat-${normalize(member.religion)}-${normalize(member.name)}`;

const getDefaultMessages = (member: ReligionMember): ChatMessage[] => [
  {
    id: 1,
    sender: 'member',
    text: `Namaste, this is ${member.name}. You can send me a message here.`
  }
];

const loadSavedMessages = (member: ReligionMember) => {
  try {
    const savedMessages = window.localStorage.getItem(getChatStorageKey(member));
    const parsedMessages = savedMessages ? JSON.parse(savedMessages) : null;

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

const ReligionMembers: React.FC = () => {
  const { religionName = '' } = useParams();
  const selectedReligion = decodeURIComponent(religionName);
  const knownReligion = religions.find(religion => normalize(religion.name) === normalize(selectedReligion));
  const displayReligion = knownReligion?.name || selectedReligion;
  const [activeChatMember, setActiveChatMember] = useState<ReligionMember | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getCurrentUser());
  const canAccessMembers = Boolean(currentUser);

  const members = useMemo(() => {
    const religionMembers = knownReligion && 'members' in knownReligion ? knownReligion.members || [] : [];
    let signupMembers: ReligionMember[] = [];

    try {
      const parsed = JSON.parse(window.localStorage.getItem(LOCAL_SIGNUPS_KEY) || '[]');
      if (Array.isArray(parsed)) {
        signupMembers = parsed
          .filter(signup => normalize(signup?.religion || '') === normalize(displayReligion))
          .map(signup => ({
            name: signup.name,
            gotra: signup.gotra,
            religion: signup.religion,
            profile: signup.profession
              ? `${signup.profession}${signup.companyName ? ` at ${signup.companyName}` : ''}`
              : 'Registered member'
          }));
      }
    } catch {
      signupMembers = [];
    }

    return [...religionMembers, ...signupMembers]
      .map(member => ({
        ...member,
        religion: displayReligion
      }))
      .filter(member =>
        `${member.name} ${member.gotra} ${member.profile || ''} ${member.religion}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [displayReligion, knownReligion, searchQuery]);

  useEffect(() => {
    const refreshCurrentUser = () => setCurrentUser(getCurrentUser());

    window.addEventListener('storage', refreshCurrentUser);
    window.addEventListener(AUTH_CHANGED_EVENT, refreshCurrentUser);

    return () => {
      window.removeEventListener('storage', refreshCurrentUser);
      window.removeEventListener(AUTH_CHANGED_EVENT, refreshCurrentUser);
    };
  }, []);

  useEffect(() => {
    if (!activeChatMember || messages.length === 0) {
      return;
    }

    window.localStorage.setItem(getChatStorageKey(activeChatMember), JSON.stringify(messages));
  }, [activeChatMember, messages]);

  const openChat = (member: ReligionMember) => {
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
              <p>{activeChatMember.religion}</p>
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
          <Link className="back-link" to="/religion-wise-jat">Back to Religions</Link>
          <h1>{displayReligion}</h1>
          <p className="hero-subtitle">Members listed in alphabetical order by name</p>
        </div>
      </section>

      <section className="section gotra-members-section">
        <div className="container">
          <SectionTitle
            title={displayReligion}
            subtitle={`${members.length} member${members.length === 1 ? '' : 's'} found`}
          />

          <div className="directory-search">
            <SearchBar placeholder={`Search ${displayReligion} members...`} onSearch={setSearchQuery} />
          </div>

          {members.length > 0 ? (
            <div className="members-list">
              {members.map(member => (
                <article className="member-row" key={`${member.name}-${member.gotra}-${displayReligion}`}>
                  <span className="member-initial">{member.name.charAt(0).toUpperCase()}</span>
                  <div>
                    <h3 className={canAccessMembers ? '' : 'member-name-locked'}>{member.name}</h3>
                    <p>{member.profile || 'Profile directory member'} - {member.gotra} gotra</p>
                  </div>
                  {canAccessMembers ? (
                    <button className="chat-link" type="button" onClick={() => openChat(member)}>
                      Chat
                    </button>
                  ) : (
                    <div className="member-auth-prompt">
                      <span>To chat, sign in or sign up.</span>
                      <Link to="/sign-in">Sign In</Link>
                      <Link to="/sign-up">Sign Up</Link>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-members">
              <h3>No members found</h3>
              <p>No {displayReligion} members are listed yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReligionMembers;
