/**
 * LoadingSpinner Component
 * Reusable animated spinner for loading states.
 */

/**
 * LoadingSpinner - Small animated spinner indicator
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.size] - Tailwind width/height classes (e.g. 'h-4 w-4')
 * @returns {JSX.Element} Animated spinner span
 */
function LoadingSpinner({ size = 'h-4 w-4' }) {
  return (
    <span
      className={`${size} animate-spin rounded-full border-2 border-slate-300 border-t-primary-600 dark:border-slate-600`}
      aria-hidden="true"
    />
  );
}

export default LoadingSpinner;
