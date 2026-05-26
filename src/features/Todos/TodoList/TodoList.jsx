/**
 * TodoList Component
 * Displays a filtered list of incomplete todos.
 * Filters out completed todos and shows a message when the list is empty.
 */
import TodoListItem from './TodoListItem.jsx';

/**
 * TodoList - List component displaying todos
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.todoList - Array of todo objects
 * @param {Function} props.onCompleteTodo - Callback to mark a todo as complete
 * @param {Function} props.onUpdateTodo - Callback to update a todo
 * @returns {JSX.Element} Unordered list of TodoListItems or empty state message
 */
function TodoList({todoList, onCompleteTodo, onUpdateTodo}) {
  const filteredTodoList = todoList.filter(todo => todo && todo.isCompleted !== true);

  return (
    <>
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {filteredTodoList.map(todo => <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo} />)}
        </ul>
      )}
    </>
  )
}

export default TodoList
