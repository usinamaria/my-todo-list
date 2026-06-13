/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { getFetchErrorMessage } from '../utils/errorMessages.js';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

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
      }
      return { success: false, error: data?.message || 'Incorrect email or password. Please try again.' };
    } catch (error) {
      return { success: false, error: getFetchErrorMessage(error, 'Something went wrong while logging in. Please try again.') };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        const options = { method: 'POST', headers: { 'X-CSRF-TOKEN': token }, credentials: 'include' };
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
      return { success: false, error: getFetchErrorMessage(error, "We couldn't reach the server, but you've been signed out.") };
    }
  };

  const value = { email, userName: email, token, isAuthenticated: !!token, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
