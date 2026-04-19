import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { useToast } from '../context/ToastContext';
import { getUserById, getPostsByUser, updateProfile, followUser } from '../services/api';
import PostCard from '../components/PostCard';
import './Profile.css';

export default function Profile() {
  const { userId } = useParams();
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const isOwnProfile = !userId || (user && userId === user._id);
  const targetId = userId || user?._id;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', skills: '', github: '' });
  const [editError, setEditError] = useState('');

  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (!targetId) { navigate('/login'); return; }
    loadProfile();
  }, [targetId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [profileRes, postsRes] = await Promise.all([
        getUserById(targetId),
        getPostsByUser(targetId),
      ]);
      const p = profileRes.data;
      setProfile(p);
      setPosts(postsRes.data);
      setFollowersCount(p.followers?.length || 0);
      setFollowing(user ? p.followers?.includes(user._id) : false);
      setEditForm({
        name: p.name || '',
        bio: p.bio || '',
        skills: (p.skills || []).join(', '),
        github: p.github || '',
      });
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setEditError('');
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) { setEditError('Name is required.'); return; }
    setSaving(true);
    try {
      const skillsArray = editForm.skills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await updateProfile({ ...editForm, skills: skillsArray });
      setProfile(res.data);
      updateUser(res.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleFollow = async () => {
    if (!user) { navigate('/login'); return; }
    setFollowLoading(true);
    try {
      const res = await followUser(profile._id);
      setFollowing(res.data.following);
      setFollowersCount(res.data.followersCount);
      toast.success(res.data.following ? `Following ${profile.name}` : `Unfollowed ${profile.name}`);
    } catch {
      toast.error('Failed to update follow');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDeletePost = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="profile-skeleton">
            <div className="skeleton" style={{ width: 96, height: 96, borderRadius: '50%' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ height: 20, width: '40%' }} />
              <div className="skeleton" style={{ height: 16, width: '60%' }} />
              <div className="skeleton" style={{ height: 14, width: '80%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="alert alert-error">User not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        {/* Profile Card */}
        <div className="profile-card card fade-in">
          <div className="profile-card__top">
            <div className="avatar avatar-xl">{initials}</div>

            <div className="profile-card__info">
              {editing ? (
                <div className="profile-edit-form">
                  {editError && <div className="alert alert-error">{editError}</div>}
                  <div className="profile-edit-grid">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input name="name" className="form-input" value={editForm.name} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">GitHub</label>
                      <input name="github" className="form-input" placeholder="github.com/username" value={editForm.github} onChange={handleEditChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Skills (comma separated)</label>
                    <input name="skills" className="form-input" placeholder="React, Node.js, Python…" value={editForm.skills} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea name="bio" className="form-input" rows={3} value={editForm.bio} onChange={handleEditChange} />
                  </div>
                  <div className="profile-edit-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setEditError(''); }}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                      {saving ? <><span className="spinner" />Saving…</> : 'Save changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="profile-name">{profile.name}</h1>
                  <p className="profile-email">{profile.email}</p>
                  {profile.bio && <p className="profile-bio">{profile.bio}</p>}

                  {profile.skills?.length > 0 && (
                    <div className="profile-skills">
                      {profile.skills.map((skill) => (
                        <Link key={skill} to={`/explore?q=${encodeURIComponent(skill)}`} className="tag tag--link">{skill}</Link>
                      ))}
                    </div>
                  )}

                  <div className="profile-meta">
                    {profile.github && (
                      <a
                        href={profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github.replace(/^(www\.)?github\.com\//, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="profile-meta__link"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    <span className="profile-meta__stat">
                      <strong>{posts.length}</strong> post{posts.length !== 1 ? 's' : ''}
                    </span>
                    <span className="profile-meta__stat">
                      <strong>{followersCount}</strong> follower{followersCount !== 1 ? 's' : ''}
                    </span>
                    <span className="profile-meta__stat">
                      <strong>{profile.following?.length || 0}</strong> following
                    </span>
                    <span className="profile-meta__joined">
                      Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="profile-card__actions">
              {isOwnProfile && !editing && (
                <button className="btn btn-ghost btn-sm profile-edit-btn" onClick={() => setEditing(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Edit
                </button>
              )}
              {!isOwnProfile && user && (
                <button
                  className={`btn btn-sm ${following ? 'btn-ghost' : 'btn-primary'}`}
                  onClick={handleFollow}
                  disabled={followLoading}
                >
                  {followLoading
                    ? <span className="spinner" style={{ width: 14, height: 14 }} />
                    : following ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="profile-posts">
          <h2 className="profile-posts__title">
            {isOwnProfile ? 'My Posts' : `Posts by ${profile.name?.split(' ')[0]}`}
            <span className="profile-posts__count">{posts.length}</span>
          </h2>

          {posts.length === 0 ? (
            <div className="profile-empty">
              <span>📝</span>
              <p>{isOwnProfile ? "You haven't posted yet." : 'No posts yet.'}</p>
              {isOwnProfile && (
                <a href="/create" className="btn btn-primary btn-sm">Write your first post</a>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
