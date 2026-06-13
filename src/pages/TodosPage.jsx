/**
 * TodosPage Component
 * Container component that manages all todo-related state and functions.
 * Handles todo CRUD operations (Create, Read, Update, Delete/Complete).
 * Uses useAuth hook to access authentication token from context.
 */
import { useReducer, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import useDebounce from '../utils/useDebounce.js';
import TodoForm from '../features/Todos/TodoForm.jsx';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import StatusFilter from '../shared/StatusFilter.jsx';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { SESSION_EXPIRED_MESSAGE, getFetchErrorMessage } from '../utils/errorMessages.js';
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer.js';

/**
 * Sorts tasks client-side, since the API does not appear to apply sorting
 * once a `page` parameter is present in the request.
 * @param {Array} tasks - Tasks returned from the API
 * @param {'createdDate'|'title'} sortBy - Field to sort by
 * @param {'asc'|'desc'} sortDirection - Sort direction
 * @returns {Array} Sorted copy of the tasks array
 */
function sortTasks(tasks, sortBy, sortDirection) {
  const field = sortBy === 'title' ? 'title' : 'createdAt';
  const direction = sortDirection === 'desc' ? -1 : 1;
  return [...tasks].sort((a, b) => {
    if (field === 'title') {
      return direction * (a.title ?? '').localeCompare(b.title ?? '', undefined, { sensitivity: 'base' });
    }
    if (a[field] < b[field]) return -direction;
    if (a[field] > b[field]) return direction;
    return 0;
  });
}

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
    page,
    totalPages,
    hasNext,
    hasPrev,
  } = state;
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const statusFilter = searchParams.get('status') || 'all';

  const handleFilterChange = (newTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: newTerm });
  };

  useEffect(() => {
    async function fetchTodos() {
      try {
        dispatch({ type: TODO_ACTIONS.FETCH_START });
        const paramsObject = { sortBy, sortDirection, page };
        if (debouncedFilterTerm) paramsObject.find = debouncedFilterTerm;
        const params = new URLSearchParams(paramsObject);
        const response = await fetch(`/api/tasks?${params.toString()}`, {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const tasks = sortTasks(data.tasks ?? [], sortBy, sortDirection);
          dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { tasks, pagination: data.pagination } });
        } else if (response.status === 401) {
          throw new Error(SESSION_EXPIRED_MESSAGE);
        } else {
          throw new Error("We couldn't load your todos. Please try again.");
        }
      } catch (error) {
        const isFilterError = debouncedFilterTerm || sortBy !== 'createdDate' || sortDirection !== 'asc';
        const fallback = isFilterError
          ? "We couldn't apply your filter or sort. Please try again."
          : "We couldn't load your todos. Please try again.";
        dispatch({ type: TODO_ACTIONS.FETCH_ERROR, payload: { message: getFetchErrorMessage(error, error.message || fallback), isFilterError } });
      }
    }
    if (token) fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm, page]);

  const handlePageChange = (newPage) => {
    dispatch({ type: TODO_ACTIONS.SET_PAGE, payload: newPage });
  };

  async function addTodo(todoTitle) {
    const newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: newTodo });
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
        credentials: 'include',
        body: JSON.stringify({ title: newTodo.title, isCompleted: newTodo.isCompleted }),
      });
      if (!response.ok) throw new Error('Failed to add todo.');
      const data = await response.json();
      dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: { tempId: newTodo.id, newTodo: data } });
    } catch {
      dispatch({ type: TODO_ACTIONS.ADD_TODO_ERROR, payload: { tempId: newTodo.id, message: "We couldn't add your todo. Please try again." } });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: { editedTodo } });
    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
        credentials: 'include',
        body: JSON.stringify({ title: editedTodo.title, isCompleted: editedTodo.isCompleted }),
      });
      if (!response.ok) throw new Error('Failed to update todo.');
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
    } catch {
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_ERROR, payload: { originalTodo, message: "We couldn't update your todo. Please try again." } });
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);
    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: { id } });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
        credentials: 'include',
        body: JSON.stringify({ title: originalTodo.title, isCompleted: true }),
      });
      if (!response.ok) throw new Error('Failed to complete todo.');
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch {
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_ERROR, payload: { originalTodo, message: "We couldn't mark your todo as complete. Please try again." } });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1>My Todos</h1>
        <p className="mt-1 text-sm text-slate-500">Keep track of what needs to get done.</p>
      </div>

      {error && (
        <div className="alert-error">
          <p>{error}</p>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })} className="btn-secondary btn-sm">
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div className="alert-warning">
          <p>{filterError}</p>
          <div className="flex gap-2">
            <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })} className="btn-secondary btn-sm">
              Clear Filter Error
            </button>
            <button onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })} className="btn-secondary btn-sm">
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <TodoForm onAddTodo={addTodo} />

      <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <StatusFilter />
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
          <SortBy
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortByChange={(newSortBy) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy: newSortBy, sortDirection } })}
            onSortDirectionChange={(newSortDirection) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection: newSortDirection } })}
          />
        </div>
      </div>

      {isTodoListLoading ? (
        <div className="card flex items-center justify-center gap-3 p-6 text-sm text-slate-500">
          <LoadingSpinner />
          Loading todos...
        </div>
      ) : (
        <TodoList
          onUpdateTodo={updateTodo}
          onCompleteTodo={completeTodo}
          todoList={todoList}
          dataVersion={dataVersion}
          statusFilter={statusFilter}
          page={page}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default TodosPage;
