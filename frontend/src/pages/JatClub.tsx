import React, { useMemo, useState } from 'react';
import { FaGlobeAsia, FaImage, FaLink, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import { clubs } from '../data/sampleData';
import { getCurrentUser } from '../utils/authStorage';
import './JatClub.css';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/HZyP180fwXaAVox7KMvvmv';
const COMMUNITY_POSTS_KEY = 'jat-club-community-posts';

type CommunityPost = {
  id: string;
  author: string;
  message: string;
  link?: string;
  mediaName?: string;
  createdAt: string;
};

const readCommunityPosts = (): CommunityPost[] => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(COMMUNITY_POSTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveCommunityPosts = (posts: CommunityPost[]) => {
  window.localStorage.setItem(COMMUNITY_POSTS_KEY, JSON.stringify(posts));
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'JP';

const JatClub: React.FC = () => {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [posts, setPosts] = useState<CommunityPost[]>(() => readCommunityPosts());
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim() && !link.trim() && !mediaName.trim()) {
      setNotice('Write a message, add a link, or attach a media file name to post.');
      return;
    }

    const post: CommunityPost = {
      id: crypto.randomUUID(),
      author: currentUser?.name || currentUser?.email || 'Community member',
      message: message.trim(),
      link: link.trim(),
      mediaName: mediaName.trim(),
      createdAt: new Date().toISOString()
    };

    const nextPosts = [post, ...posts];
    setPosts(nextPosts);
    saveCommunityPosts(nextPosts);
    setMessage('');
    setLink('');
    setMediaName('');
    setNotice('Posted in the online community.');
  };

  return (
    <div className="jat-club">
      <Navbar />

      <section className="club-hero">
        <div className="container">
          <h1>Jat Clubs & Communities</h1>
          <p className="hero-subtitle">
            Join the Jaat Samaj WhatsApp group or share updates in the online community.
          </p>
        </div>
      </section>

      <section className="section club-join-section">
        <div className="container">
          <SectionTitle
            title="Choose How You Want To Join"
            subtitle="Two simple community spaces for daily conversation, updates, links, and media sharing"
          />

          <div className="club-choice-grid">
            <article className="club-choice-card whatsapp-choice">
              <FaWhatsapp aria-hidden="true" />
              <h3>Join Jaat Samaj WhatsApp Group</h3>
              <p>Open the official WhatsApp invite and join the group for quick community conversations.</p>
              <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noreferrer" className="join-club-btn">
                Join WhatsApp Group
              </a>
            </article>

            <article className="club-choice-card website-choice">
              <FaGlobeAsia aria-hidden="true" />
              <h3>Use Website Online Community</h3>
              <p>Post messages, links, and media references directly on this website community board.</p>
              <a href="#online-community" className="join-club-btn secondary">
                Open Online Community
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="section online-community-section" id="online-community">
        <div className="container">
          <SectionTitle
            title="Website Online Community"
            subtitle="Anyone can share a message, media name, or useful link with the community"
          />

          <div className="community-layout">
            <form className="community-composer" onSubmit={handleSubmit}>
              <label>
                <span>Message</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Share an update, question, announcement, or community message"
                  rows={5}
                />
              </label>

              <label>
                <span><FaLink aria-hidden="true" /> Link</span>
                <input
                  type="url"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
                  placeholder="https://example.com"
                />
              </label>

              <label>
                <span><FaImage aria-hidden="true" /> Media</span>
                <input
                  type="text"
                  value={mediaName}
                  onChange={(event) => setMediaName(event.target.value)}
                  placeholder="Photo, video, poster, document name"
                />
              </label>

              <button type="submit" className="community-post-btn">
                <FaPaperPlane aria-hidden="true" />
                Post To Community
              </button>
              {notice && <p className="community-notice">{notice}</p>}
            </form>

            <div className="community-feed" aria-live="polite">
              {posts.length > 0 ? posts.map(post => (
                <article className="community-post" key={post.id}>
                  <div className="community-post-header">
                    <div className="community-author">
                      <span className="community-avatar" aria-hidden="true">
                        {getInitials(post.author)}
                      </span>
                      <div>
                        <strong>{post.author}</strong>
                        <span>Community member</span>
                      </div>
                    </div>
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleString()}
                    </time>
                  </div>
                  {post.message && <p>{post.message}</p>}
                  {post.link && (
                    <a href={post.link} target="_blank" rel="noreferrer" className="community-link">
                      {post.link}
                    </a>
                  )}
                  {post.mediaName && (
                    <span className="community-media">
                      <FaImage aria-hidden="true" /> {post.mediaName}
                    </span>
                  )}
                </article>
              )) : (
                <div className="community-empty">
                  <h3>No community posts yet</h3>
                  <p>Start the first conversation by sharing a message, media reference, or useful link.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section clubs-section">
        <div className="container">
          <SectionTitle
            title="Community Clubs"
            subtitle="Specialized groups for different interests and activities"
          />

          <div className="clubs-grid">
            {clubs.map((club, index) => (
              <div key={index} className="club-card">
                <div className="club-header">
                  <h3>{club.name}</h3>
                  <span className="club-members">{club.members} members</span>
                </div>
                <p className="club-description">{club.description}</p>
                <div className="club-activities">
                  <h4>Activities:</h4>
                  <p>{club.activities}</p>
                </div>
                <a href="#online-community" className="join-club-btn">Join Club</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JatClub;
