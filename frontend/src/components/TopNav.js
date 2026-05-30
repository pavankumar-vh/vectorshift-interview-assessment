import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';

export const TopNav = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = (user?.full_name || user?.username || 'U').charAt(0).toUpperCase();

  return (
    <header className="topnav">
      <div className="topnav-left">
        <Link className="topnav-brand" to="/pipelines">
          <span>VectorShift</span>
        </Link>
        <nav className="topnav-nav">
          <Link className="topnav-link active" to="/pipelines">Pipelines</Link>
        </nav>
      </div>
      <div className="topnav-right">
        <button
          className="topnav-theme-btn"
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>
        <div className="topnav-divider" />
        <div className="topnav-user">
          <div className="topnav-avatar">{initial}</div>
          <span className="topnav-username">{user?.full_name || user?.username}</span>
        </div>
        <button className="topnav-logout" type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
};
