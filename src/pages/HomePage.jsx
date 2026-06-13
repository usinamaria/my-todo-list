/**
 * HomePage Component
 * Handles the root route (/) and redirects users based on authentication status.
 * Authenticated users are redirected to /todos
 * Unauthenticated users are redirected to /login
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';

/**
 * HomePage - Root page component that conditionally redirects
 * @returns {null} This component doesn't render content, only redirects
 */
function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-slate-500 dark:text-slate-400">
      <LoadingSpinner size="h-5 w-5" />
      <p>Redirecting...</p>
    </div>
  );
}

export default HomePage;
