/**
 * LoginPage Component
 * Handles user authentication with pessimistic UI updates.
 * Uses AuthContext to manage authentication state.
 * Redirects to intended destination after successful login or to /todos by default.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * LoginPage - Authentication form page component
 * Redirects authenticated users away from login page
 * Handles login submission and redirects to intended destination or /todos
 * @component
 * @returns {JSX.Element} Login form with email and password inputs
 */
function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/todos';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setIsLoggingOn(true);
      setAuthError('');

      const result = await login(email, password);

      if (!result.success) {
        setAuthError(result.error);
      }
      // On successful login, useEffect will handle the redirect
    } catch (error) {
      setAuthError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoggingOn(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {authError && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>
          {authError}
        </p>
      )}
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>

      <button type="submit" disabled={isLoggingOn}>
        {isLoggingOn ? 'Logging in...' : 'Log On'}
      </button>
    </form>
  );
}

export default LoginPage;
