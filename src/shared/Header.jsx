/**
 * Header Component
 * Displays the application header with the main title and logout button.
 * Shared component used across multiple features.
 */
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navigation from './Navigation.jsx';
import ThemeToggle from './ThemeToggle.jsx';

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
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <h1 className="text-xl font-bold tracking-tight text-primary-700 sm:text-2xl dark:text-primary-400">
            Todo List
          </h1>
          <Navigation />
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          {isAuthenticated && (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Welcome, <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span>
            </span>
          )}
          <ThemeToggle />
          {isAuthenticated && (
            <button onClick={handleLogout} className="btn-secondary btn-sm">
              Log Off
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
