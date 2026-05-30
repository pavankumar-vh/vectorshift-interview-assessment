import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';

const demos = [
  { label: 'Demo User', role: 'Full access', email: 'demo@vectorshift.ai', pw: 'vectorshift', icon: 'D' },
  { label: 'Analyst', role: 'Read & run', email: 'analyst@vectorshift.ai', pw: 'pipelines', icon: 'A' },
];

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Visual pipeline editor',
    desc: 'Drag-and-drop nodes to build complex workflows',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'DAG validation',
    desc: 'Real-time structure checks and cycle detection',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: 'Instant sharing',
    desc: 'Generate read-only links in one click',
  },
];

export const LoginPage = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/pipelines';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fill = (d) => { setUsername(d.email); setPassword(d.pw); setError(''); };

  return (
    <div className="login-page">
      {/* Left brand panel */}
      <div className="login-hero">
        <div className="login-hero-grid" />
        <div className="login-hero-content">
          <div className="login-hero-top">
            <div className="login-logo">
              <div className="login-logo-mark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 2 13 9 20 9"/>
                  <polyline points="11 22 11 15 4 15"/>
                  <path d="M20 9l-7 7"/>
                  <path d="M4 15l7-7"/>
                </svg>
              </div>
              <span className="login-logo-text">VectorShift</span>
            </div>
          </div>

          <div className="login-hero-middle">
            <h1 className="login-hero-headline">Build pipelines<br/>visually.</h1>
            <p className="login-hero-desc">Design, validate, and deploy AI workflows with an intuitive drag-and-drop editor.</p>
          </div>

          <div className="login-hero-features">
            {features.map((f, i) => (
              <div key={i} className="login-feature">
                <div className="login-feature-icon">{f.icon}</div>
                <div>
                  <div className="login-feature-title">{f.title}</div>
                  <div className="login-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="login-hero-footer">
            <span>Pipeline Studio</span>
            <span className="login-hero-dot">·</span>
            <span>© 2026 VectorShift</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-panel">
        <div className="login-panel-top">
          <button className="topnav-theme-btn" type="button" onClick={toggleTheme} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            )}
          </button>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Sign in</h2>
            <p className="login-subtitle">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="login-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className={`login-input-group ${focusedField === 'email' ? 'focused' : ''} ${username ? 'has-value' : ''}`}>
              <label htmlFor="login-email">Email address</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                <input
                  id="login-email"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@company.com"
                  required
                  autoFocus
                  autoComplete="email"
                />
              </div>
            </div>
            <div className={`login-input-group ${focusedField === 'password' ? 'focused' : ''} ${password ? 'has-value' : ''}`}>
              <label htmlFor="login-password">Password</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>
            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><span className="spinner" /> Signing in...</>
              ) : (
                <>
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

          <div className="login-divider"><span>or use a demo account</span></div>

          <div className="login-demos">
            {demos.map((d) => (
              <button key={d.email} className="login-demo-btn" type="button" onClick={() => fill(d)}>
                <div className="login-demo-avatar">{d.icon}</div>
                <div className="login-demo-info">
                  <div className="login-demo-name">{d.label}</div>
                  <div className="login-demo-email">{d.email}</div>
                </div>
                <div className="login-demo-badge">{d.role}</div>
                <svg className="login-demo-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            ))}
          </div>
        </div>

        <div className="login-panel-footer">
          <span>Secured with JWT authentication</span>
        </div>
      </div>
    </div>
  );
};
