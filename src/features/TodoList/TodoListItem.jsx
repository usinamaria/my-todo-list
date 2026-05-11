import TextInputWithLabel from '../../shared/TextInputWithLabel';
import { useEditableTitle } from '../../hooks/useEditableTitle';

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
