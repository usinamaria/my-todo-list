/**
 * Component that renders a text input with a label.
 */
/**
 * TextInputWithLabel Component
 * Reusable form input component that combines a label and text input.
 * Used in both TodoForm and TodoListItem for input fields.
 */
import { useId } from 'react';

/**
 * TextInputWithLabel - Controlled text input with label
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.elementId] - ID for the input element and label htmlFor attribute
 * @param {string} [props.labelText] - Text to display in the label. If omitted, the label is visually hidden but still accessible.
 * @param {string} props.value - Current value of the input (controlled component)
 * @param {Function} props.onChange - Callback when input value changes
 * @param {React.Ref} [props.ref] - Ref to access the input element
 * @param {string} [props.className] - Additional classes appended to the input
 * @returns {JSX.Element} Label and input
 */
function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
  className = '',
}) {
  const generatedId = useId();
  const id = elementId || generatedId;

  return (
    <div>
      <label htmlFor={id} className={labelText ? 'field-label' : 'field-label-sr'}>
        {labelText || 'Todo title'}
      </label>
      <input
        type="text"
        id={id}
        ref={ref}
        value={value}
        onChange={onChange}
        className={`input-field ${className}`.trim()}
      />
    </div>
  );
}

export default TextInputWithLabel;
