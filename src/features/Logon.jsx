/**
 * Logon Component
 * Handles user authentication with pessimistic UI updates.
 * Waits for server confirmation before updating state (unlike optimistic updates).
 */
import { useState } from 'react';

/**
 * Logon - Authentication form component
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onSetEmail - Callback to set authenticated user email
 * @param {Function} props.onSetToken - Callback to set CSRF token
 * @returns {JSX.Element} Login form with email and password inputs
 */
function Logon({ onSetEmail, onSetToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setIsLoggingOn(true);

      const response = await fetch('/api/users/logon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        onSetEmail(data.name);
        onSetToken(data.csrfToken);
        setAuthError('');
      } else {
        setAuthError('Login failed. Please check your credentials.');
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
