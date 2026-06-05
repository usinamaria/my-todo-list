/**
 * Header Component
 * Displays the application header with the main title and logout button.
 * Shared component used across multiple features.
 */
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navigation from './Navigation.jsx';

/**
 * Header - Application header component with authentication controls
 * @component
 * @returns {JSX.Element} Header with navigation and logout button (if authenticated)
 */
function Header() {
  const { isAuthenticated, email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h1>Todo List</h1>
        <Navigation />
      </div>
      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, {email}</span>
          <button onClick={handleLogout}>Log Off</button>
        </div>
      )}
    </header>
  );
}

export default Header;
