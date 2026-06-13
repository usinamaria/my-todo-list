/**
 * ThemeToggle Component
 * Button that switches between light and dark mode.
 */
import { useTheme } from '../contexts/ThemeContext.jsx';

/**
 * ThemeToggle - Toggles the app between light and dark color schemes
 * @component
 * @returns {JSX.Element} Button showing a sun or moon icon
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className="btn-ghost btn-sm"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M12 4.5a1 1 0 0 1 1 1V6a1 1 0 1 1-2 0v-.5a1 1 0 0 1 1-1Zm0 4.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 9.5a1 1 0 0 1 1 1v.5a1 1 0 1 1-2 0V19a1 1 0 0 1 1-1Zm7.5-7.5a1 1 0 0 1 1 1h.5a1 1 0 1 1 0 2H19a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1ZM4.5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h.5a1 1 0 0 1 1 1Zm12.97-6.97a1 1 0 0 1 0 1.42l-.35.35a1 1 0 1 1-1.42-1.42l.35-.35a1 1 0 0 1 1.42 0Zm-10.64 10.64a1 1 0 0 1 0 1.41l-.35.36a1 1 0 1 1-1.41-1.42l.35-.35a1 1 0 0 1 1.41 0Zm10.64 1.41a1 1 0 0 1-1.42 0l-.35-.35a1 1 0 1 1 1.42-1.42l.35.35a1 1 0 0 1 0 1.42ZM6.83 5.03a1 1 0 0 1 0 1.42l-.35.35A1 1 0 1 1 5.06 5.4l.35-.35a1 1 0 0 1 1.42 0Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 13.64 12.07 1 1 0 0 0-.27-1.43Z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
