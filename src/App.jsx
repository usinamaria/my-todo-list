/**
 * App Component
 * Main application component that handles layout and top-level structure.
 * Serves as the entry point for the entire application.
 */
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './shared/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import TodosPage from './pages/TodosPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import RequireAuth from './components/RequireAuth.jsx';

/**
 * App - Root component for the application
 * Renders Header component and defines routes for all pages:
 * - Public routes: /, /about, /login
 * - Protected routes: /todos, /profile (require authentication)
 * - Catch-all route: * (404 handling)
 * @returns {JSX.Element} The main application layout with routes
 */
function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected routes */}
        <Route
          path="/todos"
          element={
            <RequireAuth>
              <TodosPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;