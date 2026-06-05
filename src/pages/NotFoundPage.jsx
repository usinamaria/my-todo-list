/**
 * NotFoundPage Component
 * Displays a 404 error page for unmatched routes.
 * Provides helpful navigation links back to main parts of the app.
 */
import { Link } from 'react-router-dom';

/**
 * NotFoundPage - 404 error page
 * @component
 * @returns {JSX.Element} 404 error page with navigation links
 */
function NotFoundPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <nav style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        alignItems: 'center'
      }}>
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        >
          Go to Home
        </Link>
        
        <Link 
          to="/todos" 
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        >
          View My Todos
        </Link>

        <Link 
          to="/about" 
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        >
          About This App
        </Link>

        <Link 
          to="/profile" 
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#17a2b8',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        >
          View Profile
        </Link>
      </nav>
    </div>
  );
}

export default NotFoundPage;
