/**
 * TodoList Component
 * Displays a filtered list of todos based on status.
 * Shows a context-aware empty state message when no todos match the filter.
 */
import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

/**
 * TodoList - List component displaying filtered todos
 * @param {Object} props - Component props
 * @param {Array} props.todoList - Array of todo objects
 * @param {Function} props.onCompleteTodo - Callback to mark a todo as complete
 * @param {Function} props.onUpdateTodo - Callback to update a todo
 * @param {number|string} props.dataVersion - Version indicator for memoization
 * @param {'all'|'active'|'completed'} props.statusFilter - Status filter for todos
 * @returns {JSX.Element} Unordered list of TodoListItems or empty state message
 */
function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  dataVersion,
  statusFilter = 'active',
}) {
  const filteredTodoList = useMemo(() => {
    let filteredTodos;
    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;
      case 'active':
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;
      case 'all':
      default:
        filteredTodos = todoList;
        break;
    }

    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return 'No completed todos yet. Complete some tasks to see them here.';
      case 'active':
        return 'No active todos. Add a todo above to get started.';
      case 'all':
      default:
        return 'Add todo above to get started.';
    }
  };

  return filteredTodoList.todos.length === 0 ? (
    <p>{getEmptyMessage()}</p>
  ) : (
    <ul>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
