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
 * @param {number} [props.page] - Current page number
 * @param {number} [props.totalPages] - Total number of pages available
 * @param {boolean} [props.hasNext] - Whether a next page is available
 * @param {boolean} [props.hasPrev] - Whether a previous page is available
 * @param {Function} [props.onPageChange] - Callback to change the current page
 * @returns {JSX.Element} Unordered list of TodoListItems or empty state message
 */
function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  dataVersion,
  statusFilter = 'active',
  page = 1,
  totalPages = 1,
  hasNext = false,
  hasPrev = false,
  onPageChange,
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

  return (
    <div className="flex flex-col gap-3">
      {filteredTodoList.todos.length === 0 ? (
        <p className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400">{getEmptyMessage()}</p>
      ) : (
        <ul className="card divide-y divide-slate-200 dark:divide-slate-700">
          {filteredTodoList.todos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onPageChange?.(page - 1)}
            disabled={!hasPrev}
            className="btn-secondary btn-sm"
          >
            <span aria-hidden="true">&larr;</span> Previous
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange?.(page + 1)}
            disabled={!hasNext}
            className="btn-secondary btn-sm"
          >
            Next <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default TodoList;
