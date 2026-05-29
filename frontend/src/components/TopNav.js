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

  return (
    <header className="topnav">
      <Link className="topnav-brand" to="/pipelines">
        VectorShift
      </Link>
      <div className="topnav-actions">
        <button
          className="btn btn-outline theme-toggle"
          type="button"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <div className="topnav-user">
          <div className="topnav-user-label">Signed in</div>
          <div className="topnav-user-name">
            {user?.full_name || user?.username}
          </div>
        </div>
        <button className="btn btn-ghost" type="button" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
};
