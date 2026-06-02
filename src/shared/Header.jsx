/**
 * Header Component
 * Displays the application header with the main title and logout button.
 * Shared component used across multiple features.
 */
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Header - Application header component with authentication controls
 * @component
 * @returns {JSX.Element} Header with application title and logout button (if authenticated)
 */
function Header() {
  const { isAuthenticated, email, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <h1>Todo List</h1>
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
