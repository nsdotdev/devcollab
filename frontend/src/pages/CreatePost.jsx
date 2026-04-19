import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { useToast } from '../context/ToastContext';
import { createPost } from '../services/api';
import './CreatePost.css';

const MAX_CHARS = 500;

export default function CreatePost() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ content: '', tags: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const remaining = MAX_CHARS - form.content.length;
  const isOverLimit = remaining < 0;
  const isFull = remaining <= 50;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }
    if (isOverLimit) {
      setError(`Post exceeds the ${MAX_CHARS} character limit.`);
      return;
    }
    setLoading(true);
    try {
      await createPost(form);
      toast.success('Post published!');
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
      setLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="page-container">
      <div className="create-page container">
        <div className="create-header">
          <Link to="/feed" className="create-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Feed
          </Link>
          <h1 className="create-title">New Post</h1>
        </div>

        <div className="create-card card fade-in">
          <div className="create-card__author">
            <div className="avatar avatar-md">{initials}</div>
            <div>
              <p className="create-card__name">{user?.name}</p>
              <p className="create-card__badge">Sharing with all developers</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="create-form">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="create-content-wrapper">
              <textarea
                name="content"
                className={`create-textarea ${isOverLimit ? 'create-textarea--error' : ''}`}
                placeholder="What are you building? Share a project update, ask a question, or start a discussion…"
                value={form.content}
                onChange={handleChange}
                rows={6}
                autoFocus
              />
              <div className={`create-counter ${isFull ? (isOverLimit ? 'create-counter--error' : 'create-counter--warning') : ''}`}>
                {remaining}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Tags
                <span className="create-label-hint"> — comma separated, no # needed</span>
              </label>
              <input
                type="text"
                name="tags"
                className="form-input"
                placeholder="react, nodejs, opensource, webdev…"
                value={form.tags}
                onChange={handleChange}
              />
            </div>

            {/* Tag preview */}
            {form.tags && (
              <div className="create-tag-preview">
                {form.tags
                  .split(',')
                  .map((t) => t.trim().replace(/^#/, ''))
                  .filter(Boolean)
                  .map((tag) => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
              </div>
            )}

            <div className="create-actions">
              <Link to="/feed" className="btn btn-ghost">Cancel</Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || isOverLimit || !form.content.trim()}
              >
                {loading ? (
                  <><span className="spinner" />Publishing…</>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Publish Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="create-tips">
          <h4 className="create-tips__title">Writing tips</h4>
          <div className="create-tips__grid">
            {[
              { emoji: '🏗️', tip: 'Share what you\'re currently building or learning' },
              { emoji: '❓', tip: 'Ask the community for help or code review' },
              { emoji: '🏆', tip: 'Celebrate milestones — shipped a feature? Tell us!' },
              { emoji: '#️⃣', tip: 'Add relevant tags to reach the right developers' },
            ].map(({ emoji, tip }) => (
              <div key={tip} className="create-tip">
                <span>{emoji}</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
