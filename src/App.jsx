/**
 * App Component
 * Main application component that handles layout and top-level structure.
 * Serves as the entry point for the entire application.
 */
import { useState } from 'react';
import './App.css';
import Header from './shared/Header.jsx';
import TodosPage from './features/Todos/TodosPage.jsx';
import Logon from './features/Logon.jsx';

/**
 * App - Root component for the application
 * Renders Header component and conditionally displays
 * either the Logon page or TodosPage based on authentication token
 * @returns {JSX.Element} The main application layout
 */
function App() {
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  return (
    <>
      <Header
        token={token}
        onSetToken={setToken}
        onSetEmail={setEmail}
      />

      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon
          onSetEmail={setEmail}
          onSetToken={setToken}
        />
      )}
    </>
  );
}

export default App;