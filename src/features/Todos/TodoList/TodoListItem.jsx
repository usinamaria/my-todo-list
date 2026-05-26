/**
 * TodoListItem Component
 * Individual todo item with edit and complete functionality.
 * Supports inline editing with Edit/Cancel buttons and completion checkbox.
 */
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import { useEditableTitle } from '../../../hooks/useEditableTitle';

/**
 * TodoListItem - Individual todo item component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.todo - Todo object with id, title, and isCompleted
 * @param {Function} props.onCompleteTodo - Callback to mark todo as complete
 * @param {Function} props.onUpdateTodo - Callback to update todo
 * @returns {JSX.Element} List item with checkbox, title, and edit controls
 */
function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {
  const { isEditing, workingTitle, startEditing, cancelEdit, updateTitle, finishEdit } = useEditableTitle(todo.title);

  const handleCancel = () => {
    cancelEdit();
  };

  const handleEdit = (event) => {
    updateTitle(event.target.value);
  };

  const handleUpdate = (event) => {
    if (!isEditing) return;
    event.preventDefault();
    onUpdateTodo({ ...todo, title: workingTitle });
    finishEdit();
  };

return (
  <li>
    {isEditing ? (
      <form onSubmit={handleUpdate}>
        <TextInputWithLabel
          value={workingTitle}
          onChange={handleEdit}
        />
        <button type="button" onClick={handleUpdate} disabled={!workingTitle.trim()}>
          Update
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    ) : (
      <>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onCompleteTodo(todo.id)}
        />
        <span onClick={() => startEditing()}>
          {todo.title}
        </span>
      </>
    )}
  </li>
)
}

export default TodoListItem
