/**
 * Navigation Component
 * Provides navigation links throughout the application.
 * Uses NavLink to apply active link styling automatically.
 */
import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function navClass({ isActive }) {
  const base = 'rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';
  return isActive
    ? `${base} bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300`
    : `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100`;
}

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <ul className="m-0 flex list-none flex-wrap items-center gap-1 p-0">
        <li>
          <NavLink to="/about" className={navClass}>
            About
          </NavLink>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" className={navClass}>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={navClass}>
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className={navClass}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
