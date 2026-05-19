/**
 * Component that renders a text input with a label.
 */
/**
 * TextInputWithLabel Component
 * Reusable form input component that combines a label and text input.
 * Used in both TodoForm and TodoListItem for input fields.
 */

/**
 * TextInputWithLabel - Controlled text input with label
 * @component
 * @param {Object} props - Component props
 * @param {string} props.elementId - ID for the input element and label htmlFor attribute
 * @param {string} props.labelText - Text to display in the label
 * @param {string} props.value - Current value of the input (controlled component)
 * @param {Function} props.onChange - Callback when input value changes
 * @param {React.Ref} [props.ref] - Ref to access the input element
 * @returns {JSX.Element} Label and input wrapped in a Fragment
 */
function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
}) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
