import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaPaperPlane, FaReply, FaTimes } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import SearchBar from '../components/SearchBar';
import { professionMembers, professions } from '../data/sampleData';
import './GotraMembers.css';

const LOCAL_SIGNUPS_KEY = 'jat-people-signups';

type ProfessionMember = {
  name: string;
  profession: string;
  role: string;
  gotra: string;
  location?: string;
};

type ChatMessage = {
  id: number;
  sender: 'me' | 'member';
  text: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

const getChatStorageKey = (member: ProfessionMember) =>
  `jat-people-profession-chat-${normalize(member.profession)}-${normalize(member.name)}`;

const getDefaultMessages = (member: ProfessionMember): ChatMessage[] => [
  {
    id: 1,
    sender: 'member',
    text: `Namaste, this is ${member.name}. You can send me a message here.`
  }
];

const loadSavedMessages = (member: ProfessionMember) => {
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

const ProfessionMembers: React.FC = () => {
  const { professionName = '' } = useParams();
  const selectedProfession = decodeURIComponent(professionName);
  const knownProfession = professions.find(profession => normalize(profession.name) === normalize(selectedProfession))?.name || selectedProfession;
  const [activeChatMember, setActiveChatMember] = useState<ProfessionMember | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const members = useMemo(() => {
    let signupMembers: ProfessionMember[] = [];

    try {
      const parsed = JSON.parse(window.localStorage.getItem(LOCAL_SIGNUPS_KEY) || '[]');
      if (Array.isArray(parsed)) {
        signupMembers = parsed
          .filter(signup => normalize(signup?.profession || '') === normalize(knownProfession))
          .map(signup => ({
            name: signup.name,
            profession: signup.profession,
            role: signup.companyName || signup.profession,
            gotra: signup.gotra,
            location: signup.placeName || signup.city || signup.district
          }));
      }
    } catch {
      signupMembers = [];
    }

    return [...(professionMembers as ProfessionMember[]), ...signupMembers]
      .filter(member => normalize(member.profession) === normalize(knownProfession))
      .filter(member =>
        `${member.name} ${member.role} ${member.gotra} ${member.profession}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [knownProfession, searchQuery]);

  useEffect(() => {
    if (!activeChatMember || messages.length === 0) {
      return;
    }

    window.localStorage.setItem(getChatStorageKey(activeChatMember), JSON.stringify(messages));
  }, [activeChatMember, messages]);

  const openChat = (member: ProfessionMember) => {
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
              <p>{activeChatMember.role}</p>
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
          <Link className="back-link" to="/profession-wise-jat">Back to Professions</Link>
          <h1>{knownProfession}</h1>
          <p className="hero-subtitle">Members listed in alphabetical order by name</p>
        </div>
      </section>

      <section className="section gotra-members-section">
        <div className="container">
          <SectionTitle
            title={knownProfession}
            subtitle={`${members.length} member${members.length === 1 ? '' : 's'} found`}
          />

          <div className="directory-search">
            <SearchBar placeholder={`Search ${knownProfession} members...`} onSearch={setSearchQuery} />
          </div>

          {members.length > 0 ? (
            <div className="members-list">
              {members.map(member => (
                <article className="member-row" key={`${member.name}-${member.profession}`}>
                  <span className="member-initial">{member.name.charAt(0).toUpperCase()}</span>
                  <div>
                    <h3>{member.name}</h3>
                    <p>{member.role} • {member.gotra} gotra</p>
                  </div>
                  <button className="chat-link" type="button" onClick={() => openChat(member)}>
                    Chat
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-members">
              <h3>No members found</h3>
              <p>No {knownProfession} members are listed yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfessionMembers;
