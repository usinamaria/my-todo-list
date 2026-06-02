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
import { useMemo } from 'react';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion }) {
  const filteredTodoList = useMemo(() => {
    return {
      version: dataVersion,
      todos: todoList.filter(todo => todo && todo.isCompleted !== true)
    };
  }, [todoList, dataVersion]);

  return (
    <>
      {filteredTodoList.todos.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {filteredTodoList.todos.map(todo => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList
