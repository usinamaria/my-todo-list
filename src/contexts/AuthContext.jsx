/**
 * AuthContext
 * Manages authentication state and functions globally.
 * Eliminates prop drilling for email, token, and auth functions.
 */
import { createContext, useContext, useState } from 'react';

// ========================================
// Create the Context
// ========================================
const AuthContext = createContext();

// ========================================
// Custom useAuth Hook
// ========================================
/**
 * Custom hook to access authentication context.
 * Must be used within an AuthProvider.
 * @returns {Object} Authentication state and functions
 * @throws {Error} If not used within an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ========================================
// AuthProvider Component
// ========================================
/**
 * AuthProvider - Wraps application and provides authentication context
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Context provider wrapping children
 */
export function AuthProvider({ children }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  // ========================================
  // LOGIN
  // ========================================
  const login = async (userEmail, password) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
      };

      const res = await fetch('/api/users/logon', options);
      const data = await res.json();

      if (res.status === 200 && data.name && data.csrfToken) {
        // Success: Update state
        setEmail(data.name);
        setToken(data.csrfToken);
        return { success: true };
      } else {
        // Failure: Return error
        return {
          success: false,
          error: `Authentication failed: ${data?.message || 'Unknown error'}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Network error during login: ${error.message}`,
      };
    }
  };

  // ========================================
  // LOGOUT
  // ========================================
  const logout = async () => {
    try {
      // Only make API call if we have a token
      if (token) {
        const options = {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        };

        await fetch('/api/users/logoff', options);
      }

      // Always clear local state, regardless of API success
      setEmail('');
      setToken('');
      return { success: true };
    } catch (error) {
      // Clear state even if API call fails
      setEmail('');
      setToken('');
      return {
        success: false,
        error: `Logout error: ${error.message}`,
      };
    }
  };

  // ========================================
  // Context Value
  // ========================================
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
