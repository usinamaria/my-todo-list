/**
 * TodoListItem Component
 * Individual todo item with edit and complete functionality.
 * Supports inline editing with Edit/Cancel buttons and completion checkbox.
 */
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import Checkbox from '../../../shared/Checkbox';
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
  <li className="px-4 py-3">
    {isEditing ? (
      <form onSubmit={handleUpdate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <TextInputWithLabel
            value={workingTitle}
            onChange={handleEdit}
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleUpdate} disabled={!workingTitle.trim()} className="btn-primary btn-sm">
            Update
          </button>
          <button type="button" onClick={handleCancel} className="btn-secondary btn-sm">
            Cancel
          </button>
        </div>
      </form>
    ) : (
      <div className="flex items-center gap-3">
        <Checkbox
          checked={todo.isCompleted}
          onChange={() => onCompleteTodo(todo.id)}
          ariaLabel={`Mark "${todo.title}" as ${todo.isCompleted ? 'active' : 'completed'}`}
        />
        <span
          onClick={() => startEditing()}
          className={`flex-1 cursor-pointer wrap-break-word transition-colors ${
            todo.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 hover:text-primary-700'
          }`}
        >
          {todo.title}
        </span>
      </div>
    )}
  </li>
)
}

export default TodoListItem
