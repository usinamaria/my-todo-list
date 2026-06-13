/**
 * RequireAuth Component
 * Protects routes that require authentication.
 * Redirects unauthenticated users to the login page and preserves destination state.
 */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * RequireAuth - Route guard wrapper for authenticated pages
 * @param {object} props
 * @param {JSX.Element} props.children - The protected content to render
 * @returns {JSX.Element} The children when authenticated or a redirect/loading state
 */
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) {
    return <p>Redirecting to login...</p>;
  }

  return children;
}

export default RequireAuth;
