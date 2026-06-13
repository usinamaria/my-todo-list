/**
 * NotFoundPage Component
 * Displays a 404 error page for unmatched routes.
 * Provides helpful navigation links back to main parts of the app.
 */
import { Link } from 'react-router';

/**
 * NotFoundPage - 404 error page
 * @component
 * @returns {JSX.Element} 404 error page with navigation links
 */
function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
      <h1 className="text-7xl font-extrabold text-primary-600">404</h1>
      <h2>Page Not Found</h2>
      <p className="text-base text-slate-500">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <nav className="mt-2 flex w-full flex-col items-stretch gap-3 sm:max-w-xs">
        <Link to="/" className="btn-primary">
          Go to Home
        </Link>

        <Link to="/todos" className="btn-secondary">
          View My Todos
        </Link>

        <Link to="/about" className="btn-secondary">
          About This App
        </Link>

        <Link to="/profile" className="btn-secondary">
          View Profile
        </Link>
      </nav>
    </div>
  );
}

export default NotFoundPage;
