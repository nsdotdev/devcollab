import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { getPosts } from '../services/api';
import PostCard from '../components/PostCard';
import './Feed.css';

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ height: 14, width: '40%' }} />
          <div className="skeleton" style={{ height: 12, width: '60%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="skeleton" style={{ height: 14, width: '100%' }} />
        <div className="skeleton" style={{ height: 14, width: '85%' }} />
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
      </div>
    </div>
  );
}

export default function Feed() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTag = searchParams.get('tag') || '';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (pageNum = 1, append = false, tag = '') => {
    try {
      const res = await getPosts(pageNum, tag);
      const { posts: newPosts, pages } = res.data;
      setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
      setHasMore(pageNum < pages);
    } catch {
      setError('Failed to load posts. Is the backend running?');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchPosts(1, false, activeTag);
  }, [fetchPosts, activeTag]);

  const handleLoadMore = async () => {
    const next = page + 1;
    setPage(next);
    setLoadingMore(true);
    await fetchPosts(next, true, activeTag);
  };

  const handleDelete = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  return (
    <div className="page-container">
      <div className="feed-layout container--wide">
        {/* Main Feed */}
        <main className="feed-main">
          {/* Feed Header */}
          <div className="feed-header">
            <h1 className="feed-title">Developer Feed</h1>
            {user && (
              <Link to="/create" className="btn btn-primary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Post
              </Link>
            )}
          </div>

          {/* Active tag filter */}
          {activeTag && (
            <div className="feed-tag-filter">
              <span>Showing posts tagged</span>
              <span className="tag">#{activeTag}</span>
              <button className="feed-tag-filter__clear" onClick={() => navigate('/feed')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Clear
              </button>
            </div>
          )}

          {/* Quick compose bar */}
          {user && (
            <Link to="/create" className="feed-compose">
              <div className="avatar avatar-sm">
                {user.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="feed-compose__input">
                What are you building today?
              </div>
              <span className="btn btn-primary btn-sm">Post</span>
            </Link>
          )}

          {/* Error state */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="feed-list">
              {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Posts */}
          {!loading && !error && (
            <>
              {posts.length === 0 ? (
                <div className="feed-empty">
                  <div className="feed-empty__icon">🚀</div>
                  <h3>No posts yet</h3>
                  <p>Be the first to share something with the community!</p>
                  {user ? (
                    <Link to="/create" className="btn btn-primary">Create First Post</Link>
                  ) : (
                    <Link to="/register" className="btn btn-primary">Join DevCollab</Link>
                  )}
                </div>
              ) : (
                <div className="feed-list">
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} onDelete={handleDelete} />
                  ))}
                </div>
              )}

              {hasMore && posts.length > 0 && (
                <button
                  className="btn btn-ghost feed-load-more"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? <><span className="spinner" />Loading…</> : 'Load more posts'}
                </button>
              )}
            </>
          )}
        </main>

        {/* Sidebar */}
        <aside className="feed-sidebar">
          {/* Welcome / CTA */}
          {!user ? (
            <div className="sidebar-card">
              <div className="sidebar-card__icon">👋</div>
              <h3 className="sidebar-card__title">Join DevCollab</h3>
              <p className="sidebar-card__desc">Connect with developers, share your projects, and grow your network.</p>
              <div className="sidebar-card__actions">
                <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Get started — free
                </Link>
                <Link to="/login" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <div className="sidebar-card sidebar-card--profile">
              <div className="avatar avatar-md">
                {user.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p className="sidebar-profile__name">{user.name}</p>
                <p className="sidebar-profile__email">{user.email}</p>
              </div>
              <Link to="/profile" className="btn btn-ghost btn-sm" style={{ marginTop: 8, alignSelf: 'stretch', justifyContent: 'center' }}>
                View Profile
              </Link>
            </div>
          )}

          {/* Tips card */}
          <div className="sidebar-tips">
            <h4 className="sidebar-tips__title">
              <span>💡</span> Tips for great posts
            </h4>
            <ul className="sidebar-tips__list">
              <li>Share what you're building</li>
              <li>Ask for help or feedback</li>
              <li>Celebrate your wins</li>
              <li>Add tags to reach more devs</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
