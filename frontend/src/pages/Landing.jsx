import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import './Landing.css';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Connect with Developers',
    desc: 'Follow fellow engineers, discover their work, and build a network that actually matters in your career.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: 'Share Your Projects',
    desc: 'Post about what you\'re building, get feedback from real developers, and celebrate your wins publicly.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Real Conversations',
    desc: 'Comment on posts, discuss tech decisions, ask questions — a feed built for technical depth, not hot takes.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: 'Discover by Skills',
    desc: 'Filter developers by stack — React, Node, Go, Python. Find collaborators who complement your skill set.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Showcase Your Stack',
    desc: 'Your profile is your dev identity — skills, GitHub, bio, and everything you\'ve shipped in one place.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
    title: 'GitHub-first',
    desc: 'Link your GitHub profile, share repo links in posts, and let your code speak louder than your resume.',
  },
];

const steps = [
  { num: '01', title: 'Create your profile', desc: 'Sign up in 30 seconds — add your skills, bio, and GitHub.' },
  { num: '02', title: 'Share what you\'re building', desc: 'Post updates, ask questions, or share a win. Tag it so the right people find it.' },
  { num: '03', title: 'Grow your dev network', desc: 'Follow developers you admire. Comment, collaborate, and keep building.' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__hero-inner">
          <div className="landing__badge">
            <span className="landing__badge-dot" />
            Built for developers, by a developer
          </div>
          <h1 className="landing__headline">
            Where developers<br />
            <span className="landing__headline-accent">share, connect</span><br />
            and grow.
          </h1>
          <p className="landing__subheadline">
            DevCollab is the social layer for your dev career — post what you're building,
            discover other engineers, and build relationships that outlast any job title.
          </p>
          <div className="landing__cta">
            {user ? (
              <>
                <Link to="/feed" className="btn btn-primary landing__cta-btn">
                  Go to Feed
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link to="/explore" className="btn btn-ghost landing__cta-btn">Explore developers</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary landing__cta-btn">
                  Get started — free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link to="/feed" className="btn btn-ghost landing__cta-btn">Browse the feed</Link>
              </>
            )}
          </div>
          <p className="landing__no-cc">No credit card. No nonsense. Just devs.</p>
        </div>

        {/* Hero visual */}
        <div className="landing__hero-visual">
          <div className="landing__mock-card">
            <div className="landing__mock-header">
              <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>NS</div>
              <div>
                <p className="landing__mock-name">Nitin Sonu</p>
                <p className="landing__mock-meta">Full Stack Developer · 2m ago</p>
              </div>
            </div>
            <p className="landing__mock-content">
              Just shipped the auth system for my new SaaS — JWT + refresh tokens, 30-day sessions, auto-logout on expiry. Took a week but it's solid. 🚀
            </p>
            <div className="landing__mock-tags">
              <span className="tag">#nodejs</span>
              <span className="tag">#jwt</span>
              <span className="tag">#saas</span>
            </div>
            <div className="landing__mock-actions">
              <span className="landing__mock-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                24 likes
              </span>
              <span className="landing__mock-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                8 comments
              </span>
            </div>
          </div>
          <div className="landing__mock-card landing__mock-card--offset">
            <div className="landing__mock-header">
              <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }}>AK</div>
              <div>
                <p className="landing__mock-name">Arjun Kumar</p>
                <p className="landing__mock-meta">Backend Engineer · 15m ago</p>
              </div>
            </div>
            <p className="landing__mock-content">
              Anyone else using Bun for their Node projects? Seeing 3x speed improvements on build times vs npm.
            </p>
            <div className="landing__mock-tags">
              <span className="tag">#bun</span>
              <span className="tag">#nodejs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing__features">
        <div className="landing__section-inner">
          <div className="landing__section-label">Features</div>
          <h2 className="landing__section-title">Everything a dev network should be</h2>
          <p className="landing__section-sub">No algorithm pushing ads. No vanity metrics. Just signal.</p>
          <div className="landing__features-grid">
            {features.map((f) => (
              <div key={f.title} className="landing__feature-card">
                <div className="landing__feature-icon">{f.icon}</div>
                <h3 className="landing__feature-title">{f.title}</h3>
                <p className="landing__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing__how">
        <div className="landing__section-inner">
          <div className="landing__section-label">How it works</div>
          <h2 className="landing__section-title">Up and running in minutes</h2>
          <div className="landing__steps">
            {steps.map((s) => (
              <div key={s.num} className="landing__step">
                <div className="landing__step-num">{s.num}</div>
                <div>
                  <h3 className="landing__step-title">{s.title}</h3>
                  <p className="landing__step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="landing__banner">
        <div className="landing__section-inner landing__banner-inner">
          <h2 className="landing__banner-title">Ready to join the community?</h2>
          <p className="landing__banner-sub">Hundreds of developers already sharing, building, and connecting.</p>
          <div className="landing__cta">
            {user ? (
              <Link to="/feed" className="btn btn-primary landing__cta-btn">Back to Feed</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary landing__cta-btn">Create your profile</Link>
                <Link to="/login" className="btn btn-ghost landing__cta-btn" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Sign in</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__section-inner landing__footer-inner">
          <div className="landing__footer-logo">
            <span className="navbar__logo-icon" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-light)', padding: '3px 7px', borderRadius: 'var(--radius-sm)' }}>{'</>'}</span>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>DevCollab</span>
          </div>
          <p className="landing__footer-copy">© {new Date().getFullYear()} DevCollab. Built for developers.</p>
        </div>
      </footer>
    </div>
  );
}
