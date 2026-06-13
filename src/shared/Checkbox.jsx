/**
 * Checkbox Component
 * Reusable styled checkbox input.
 */

/**
 * Checkbox - Controlled checkbox input
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.checked - Whether the checkbox is checked (controlled)
 * @param {Function} props.onChange - Callback when the checked state changes
 * @param {string} [props.ariaLabel] - Accessible label for the checkbox
 * @param {string} [props.id] - ID for the checkbox element
 * @param {string} [props.className] - Additional classes appended to the checkbox
 * @returns {JSX.Element} Styled checkbox input
 */
function Checkbox({ checked, onChange, ariaLabel, id, className = '' }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      className={`checkbox-field ${className}`.trim()}
    />
  );
}

export default Checkbox;
