import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useToast } from '../context/ToastContext';
import { registerUser } from '../services/api';
import './Auth.css';

export default function Register() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', bio: '', skills: '', github: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await registerUser(form);
      login(res.data);
      toast.success(`Welcome to DevCollab, ${res.data.name?.split(' ')[0]}!`);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-container">
      <div className="auth-container auth-container--wide fade-in">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="auth-logo-icon">{'</>'}</span>
          </div>
          <h1 className="auth-title">Join DevCollab</h1>
          <p className="auth-subtitle">Connect with developers around the world</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="auth-form-grid">
            <div className="form-group">
              <label className="form-label">Full name <span className="auth-required">*</span></label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Jane Smith"
                value={form.name}
                onChange={handleChange}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email address <span className="auth-required">*</span></label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="auth-required">*</span></label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub username / URL</label>
              <input
                type="text"
                name="github"
                className="form-input"
                placeholder="github.com/username"
                value={form.github}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills <span className="auth-hint">(comma separated)</span></label>
            <input
              type="text"
              name="skills"
              className="form-input"
              placeholder="React, Node.js, Python, MongoDB…"
              value={form.skills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio <span className="auth-hint">(optional)</span></label>
            <textarea
              name="bio"
              className="form-input"
              placeholder="Tell the community about yourself…"
              value={form.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <><span className="spinner" />Creating account…</> : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
