import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';

const demoAccounts = [
  {
    label: 'Demo User',
    username: 'demo@vectorshift.ai',
    password: 'vectorshift',
  },
  {
    label: 'Pipeline Analyst',
    username: 'analyst@vectorshift.ai',
    password: 'pipelines',
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-layout">
        <section className="login-hero">
          <div className="login-hero-top">
            <div className="login-kicker">VectorShift</div>
            <button
              className="btn btn-outline theme-toggle"
              type="button"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
          <div className="login-hero-content">
            <h1>Build reliable pipelines faster.</h1>
            <p>
              Compose logic visually, validate DAG integrity, and share results
              with your team in seconds.
            </p>
            <ul className="login-feature-list">
              <li>Drag-and-drop builder with smart nodes</li>
              <li>Instant validation and run history</li>
              <li>Shareable read-only links</li>
            </ul>
          </div>
          <div className="login-hero-footer">
            Trusted by teams building data and AI workflows.
          </div>
        </section>

        <section className="login-panel">
          <div className="login-card">
            <h2>Sign in to your workspace</h2>
            <p className="login-subtitle">
              Use the demo credentials or your assigned account to continue.
            </p>

            {error ? <div className="banner banner-error">{error}</div> : null}

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="form-field">
                <span>Email</span>
                <input
                  type="email"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </label>
              <label className="form-field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  required
                />
              </label>
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="login-demo">
              <div className="login-demo-title">Demo accounts</div>
              {demoAccounts.map((account) => (
                <div key={account.username} className="login-demo-item">
                  <div>
                    <div className="login-demo-label">{account.label}</div>
                    <div className="login-demo-meta">{account.username}</div>
                  </div>
                  <div className="login-demo-password">{account.password}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
