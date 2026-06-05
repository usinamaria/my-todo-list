/**
 * HomePage Component
 * Handles the root route (/) and redirects users based on authentication status.
 * Authenticated users are redirected to /todos
 * Unauthenticated users are redirected to /login
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

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
    <div>
        <p>Redirecting...</p>
    </div>
  );
}

export default HomePage;
