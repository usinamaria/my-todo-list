/**
 * AboutPage Component
 * Displays information about the todo application.
 * Provides details about app features and technologies used.
 */

/**
 * AboutPage - Application information page
 * @component
 * @returns {JSX.Element} About page content
 */
function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>About My Todo List</h1>
      
      <section style={{ marginTop: '2rem' }}>
        <h2>Features</h2>
        <ul>
          <li>Create, read, update, and delete todos</li>
          <li>Mark todos as complete or incomplete</li>
          <li>Filter todos by search term</li>
          <li>Sort todos by creation date or title</li>
          <li>User authentication and authorization</li>
          <li>Persistent storage with backend API</li>
          <li>Optimistic UI updates for better user experience</li>
          <li>Real-time todo list management</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Technologies Used</h2>
        <ul>
          <li><strong>React</strong> - JavaScript library for building user interfaces</li>
          <li><strong>React Router</strong> - Client-side routing for single-page applications</li>
          <li><strong>Vite</strong> - Fast and modern build tool for web applications</li>
          <li><strong>Context API</strong> - State management for authentication</li>
          <li><strong>Hooks</strong> - useReducer, useEffect, useState, useContext for component logic</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Architecture</h2>
        <p>
          This application follows modern React patterns with component-based architecture,
          context-based state management for authentication, and reducer patterns for complex
          todo list state management. Routes are protected and redirect unauthenticated users
          to the login page.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;
