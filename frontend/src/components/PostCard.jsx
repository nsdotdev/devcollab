import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../App';
import { useToast } from '../context/ToastContext';
import { likePost, deletePost, addComment, deleteComment } from '../services/api';
import './PostCard.css';

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getInitials(name) {
  return (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function githubUrl(raw) {
  if (!raw) return null;
  if (raw.startsWith('http')) return raw;
  const username = raw.replace(/^(www\.)?github\.com\//, '');
  return `https://github.com/${username}`;
}

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState(user ? post.likes?.includes(user._id) : false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const authorName = post.user?.name || 'Unknown';
  const authorId = post.user?._id;
  const isOwner = user && user._id === authorId;

  const handleLike = async () => {
    if (!user) return navigate('/login');
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await likePost(post._id);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch {
      toast.error('Failed to update like');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await deletePost(post._id);
      toast.success('Post deleted');
      onDelete && onDelete(post._id);
    } catch {
      toast.error('Failed to delete post');
      setDeleting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) return navigate('/login');
    setCommentLoading(true);
    try {
      const res = await addComment(post._id, commentText.trim());
      setComments((prev) => [...prev, res.data]);
      setCommentText('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(post._id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <article className="post-card fade-in">
      {/* Header */}
      <div className="post-card__header">
        <Link to={`/profile/${authorId}`} className="post-card__author">
          <div className="avatar avatar-sm">{getInitials(authorName)}</div>
          <div className="post-card__author-info">
            <span className="post-card__author-name">{authorName}</span>
            {post.user?.bio && (
              <span className="post-card__author-bio">{post.user.bio}</span>
            )}
          </div>
        </Link>
        <span className="post-card__time">{timeAgo(post.createdAt)}</span>
      </div>

      {/* Content */}
      <p className="post-card__content">{post.content}</p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="post-card__tags">
          {post.tags.map((tag) => (
            <Link key={tag} to={`/feed?tag=${encodeURIComponent(tag)}`} className="tag tag--link">#{tag}</Link>
          ))}
        </div>
      )}


      {/* Footer actions */}
      <div className="post-card__footer">
        <div className="post-card__actions">
          <button
            className={`post-card__btn post-card__btn--like ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={likeLoading}
            title={user ? (liked ? 'Unlike' : 'Like') : 'Login to like'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{likes.length}</span>
          </button>

          <button
            className={`post-card__btn post-card__btn--comment ${showComments ? 'active' : ''}`}
            onClick={() => setShowComments((v) => !v)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{comments.length}</span>
          </button>

          {post.user?.github && (
            <a
              href={githubUrl(post.user.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="post-card__btn"
              title="View GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}
        </div>

        {isOwner && (
          <button
            className="post-card__btn post-card__btn--delete"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete post"
          >
            {deleting ? (
              <span className="spinner" style={{ width: 14, height: 14 }} />
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="post-card__comments">
          {comments.length === 0 && (
            <p className="post-card__comments-empty">No comments yet. Be the first!</p>
          )}
          {comments.map((c) => (
            <div key={c._id} className="post-card__comment">
              <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.7rem', flexShrink: 0 }}>
                {getInitials(c.user?.name)}
              </div>
              <div className="post-card__comment-body">
                <span className="post-card__comment-name">{c.user?.name || 'User'}</span>
                <span className="post-card__comment-time">{timeAgo(c.createdAt)}</span>
                <p className="post-card__comment-text">{c.text}</p>
              </div>
              {user && c.user?._id === user._id && (
                <button
                  className="post-card__comment-del"
                  onClick={() => handleDeleteComment(c._id)}
                  title="Delete comment"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {user && (
            <form className="post-card__comment-form" onSubmit={handleAddComment}>
              <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.7rem', flexShrink: 0 }}>
                {getInitials(user.name)}
              </div>
              <input
                className="post-card__comment-input form-input"
                placeholder="Write a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={300}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!commentText.trim() || commentLoading}
              >
                {commentLoading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Post'}
              </button>
            </form>
          )}

          {!user && (
            <p className="post-card__comments-empty">
              <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link> to comment
            </p>
          )}
        </div>
      )}
    </article>
  );
}
