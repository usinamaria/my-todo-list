/**
 * App Component
 * Main application component that handles layout and top-level structure.
 * Serves as the entry point for the entire application.
 */
import './App.css';
import { useAuth } from './contexts/AuthContext.jsx';
import Header from './shared/Header.jsx';
import TodosPage from './features/Todos/TodosPage.jsx';
import Logon from './features/Logon.jsx';

/**
 * App - Root component for the application
 * Renders Header component and conditionally displays
 * either the Logon page or TodosPage based on authentication status.
 * Uses useAuth hook to access authentication context.
 * @returns {JSX.Element} The main application layout
 */
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      {isAuthenticated ? <TodosPage /> : <Logon />}
    </>
  );
}

export default App;