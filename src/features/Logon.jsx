/**
 * Logon Component
 * Handles user authentication with pessimistic UI updates.
 * Uses AuthContext to manage authentication state.
 */
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Logon - Authentication form component
 * @component
 * @returns {JSX.Element} Login form with email and password inputs
 */
function Logon() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setIsLoggingOn(true);
      setAuthError('');

      const result = await login(email, password);

      if (!result.success) {
        setAuthError(result.error);
      }
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

export default Logon;
