import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../App';
import { useToast } from '../context/ToastContext';
import { getUsers, searchUsers, followUser } from '../services/api';
import './Explore.css';

function UserCard({ u, currentUser, onFollow }) {
  const initials = u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const isMe = currentUser && currentUser._id === u._id;
  const isFollowing = currentUser && u.followers?.includes(currentUser._id);
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleFollow = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await followUser(u._id);
      setFollowing(res.data.following);
      onFollow && onFollow(u._id, res.data.following);
      toast.success(res.data.following ? `Following ${u.name}` : `Unfollowed ${u.name}`);
    } catch {
      toast.error('Failed to update follow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="explore-user-card fade-in">
      <div className="explore-user-card__top">
        <Link to={`/profile/${u._id}`} className="explore-user-card__avatar-link">
          <div className="avatar avatar-md">{initials}</div>
        </Link>
        {!isMe && currentUser && (
          <button
            className={`btn btn-sm ${following ? 'btn-ghost' : 'btn-primary'}`}
            onClick={handleFollow}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 13, height: 13 }} /> : following ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
      <Link to={`/profile/${u._id}`} className="explore-user-card__name">{u.name}</Link>
      {u.bio && <p className="explore-user-card__bio">{u.bio}</p>}
      {u.skills?.length > 0 && (
        <div className="explore-user-card__skills">
          {u.skills.slice(0, 5).map((s) => (
            <Link key={s} to={`/explore?q=${encodeURIComponent(s)}`} className="tag tag--link">{s}</Link>
          ))}
        </div>
      )}
      <div className="explore-user-card__meta">
        <span>{u.followers?.length || 0} followers</span>
        {u.github && (
          <a
            href={u.github.startsWith('http') ? u.github : `https://github.com/${u.github.replace(/^(www\.)?github\.com\//, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="explore-user-card__github"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}

function SkeletonUserCard() {
  return (
    <div className="explore-user-card">
      <div className="explore-user-card__top">
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
        <div className="skeleton" style={{ width: 72, height: 30, borderRadius: 8 }} />
      </div>
      <div className="skeleton" style={{ height: 14, width: '60%', marginTop: 4 }} />
      <div className="skeleton" style={{ height: 12, width: '80%' }} />
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <div className="skeleton" style={{ height: 24, width: 60, borderRadius: 99 }} />
        <div className="skeleton" style={{ height: 24, width: 48, borderRadius: 99 }} />
      </div>
    </div>
  );
}

export default function Explore() {
  const { user } = useAuth();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQ = searchParams.get('q') || '';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(urlQ);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(urlQ);
    setLoading(true);
    if (urlQ) {
      searchUsers(urlQ)
        .then((res) => setUsers(res.data))
        .catch(() => toast.error('Search failed'))
        .finally(() => setLoading(false));
    } else {
      getUsers()
        .then((res) => setUsers(res.data))
        .catch(() => toast.error('Failed to load users'))
        .finally(() => setLoading(false));
    }
  }, [urlQ]);

  const handleSearch = (value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        setSearchParams({ q: value.trim() });
      } else {
        setSearchParams({});
      }
    }, 400);
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
  };

  return (
    <div className="page-container">
      <div className="container--wide">
        {/* Header */}
        <div className="explore-header">
          <div>
            <h1 className="explore-title">Explore Developers</h1>
            <p className="explore-sub">Discover developers by name, skill, or bio</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="explore-search">
          <div className="explore-search__input-wrap">
            <svg className="explore-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="form-input explore-search__input"
              placeholder="Search by name, skill, or bio…"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {query && (
              <button className="explore-search__clear" onClick={handleClear}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          {searching && <span className="spinner" />}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="explore-count">
            {users.length} developer{users.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="explore-grid">
            {[...Array(8)].map((_, i) => <SkeletonUserCard key={i} />)}
          </div>
        ) : users.length === 0 ? (
          <div className="explore-empty">
            <div style={{ fontSize: '2.5rem' }}>🔍</div>
            <h3>No developers found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className="explore-grid">
            {users.map((u) => (
              <UserCard key={u._id} u={u} currentUser={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
