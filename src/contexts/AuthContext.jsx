/**
 * AuthContext
 * Manages authentication state and functions globally.
 * Eliminates prop drilling for email, token, and auth functions.
 */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

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

/**
 * AuthProvider - Wraps application and provides authentication context
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Context provider wrapping children
 */
const STORAGE_EMAIL = 'todo-app-email';
const STORAGE_TOKEN = 'todo-app-token';

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(() => localStorage.getItem(STORAGE_EMAIL) || '');
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN) || '');

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
        setEmail(data.name);
        setToken(data.csrfToken);
        localStorage.setItem(STORAGE_EMAIL, data.name);
        localStorage.setItem(STORAGE_TOKEN, data.csrfToken);
        return { success: true };
      } else {
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

  const logout = async () => {
    try {
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

      setEmail('');
      setToken('');
      localStorage.removeItem(STORAGE_EMAIL);
      localStorage.removeItem(STORAGE_TOKEN);
      return { success: true };
    } catch (error) {
      setEmail('');
      setToken('');
      localStorage.removeItem(STORAGE_EMAIL);
      localStorage.removeItem(STORAGE_TOKEN);
      return {
        success: false,
        error: `Logout error: ${error.message}`,
      };
    }
  };

  const value = {
    email,
    userName: email,
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
