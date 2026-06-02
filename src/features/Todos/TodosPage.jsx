/**
 * TodosPage Component
 * Container component that manages all todo-related state and functions.
 * Handles todo CRUD operations (Create, Read, Update, Delete/Complete).
 * Uses useAuth hook to access authentication token from context.
 */
import { useReducer, useEffect } from 'react';
import useDebounce from '../../utils/useDebounce.js';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../../reducers/todoReducer.js';

/**
 * TodosPage - Main feature page for todo management
 * @component
 * @returns {JSX.Element} Todo form and list components
 */
function TodosPage() {
  const { token } = useAuth();
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
  } = state;
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const handleFilterChange = (newTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: newTerm });
  };

  useEffect(() => {
    async function fetchTodos() {
      try {
        dispatch({ type: TODO_ACTIONS.FETCH_START });

        const paramsObject = {
          sortBy,
          sortDirection,
        };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObject);
        const response = await fetch(`/api/tasks?${params.toString()}`, {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: { tasks: data.tasks ?? [] },
          });
        } else if (response.status === 401) {
          throw new Error('unauthorized');
        } else {
          throw new Error('Failed to fetch todos.');
        }
      } catch (error) {
        const isFilterError =
          debouncedFilterTerm ||
          sortBy !== 'creationDate' ||
          sortDirection !== 'desc';
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: `Error ${isFilterError ? 'filtering/sorting' : 'fetching'} todos: ${error.message}`,
            isFilterError,
          },
        });
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  // -----------------------------
  // ADD TODO (Optimistic)
  // -----------------------------
  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: newTodo,
    });

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: newTodo.title,
          isCompleted: newTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo.');
      }

      const data = await response.json();

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          tempId: newTodo.id,
          newTodo: data,
        },
      });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          tempId: newTodo.id,
          message: 'Unable to add todo.',
        },
      });
    }
  }

  // -----------------------------
  // UPDATE TODO (Optimistic)
  // -----------------------------
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      todo => todo.id === editedTodo.id
    );

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { editedTodo },
    });

    try {
      const response = await fetch(
        `/api/tasks/${editedTodo.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
          body: JSON.stringify({
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update todo.');
      }
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          originalTodo,
          message: 'Unable to update todo.',
        },
      });
    }
  }

  // -----------------------------
  // COMPLETE TODO (Optimistic)
  // -----------------------------
  async function completeTodo(id) {
    const originalTodo = todoList.find(todo => todo.id === id);

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: originalTodo.title,
          isCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo.');
      }
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          originalTodo,
          message: 'Unable to complete todo.',
        },
      });
    }
  }
  return (
    <>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          <p>{error}</p>
          <button
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
                payload: { type: 'general' },
              })
            }
          >
            Clear Error
          </button>
        </div>
      )}
      {filterError && (
        <div style={{ color: 'orange', marginBottom: '1rem' }}>
          <p>{filterError}</p>
          <button
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
                payload: { type: 'filter' },
              })
            }
          >
            Clear Filter Error
          </button>{' '}
          <button
            onClick={() =>
              dispatch({ type: TODO_ACTIONS.RESET_FILTERS })
            }
          >
            Reset Filters
          </button>
        </div>
      )}
      {isTodoListLoading && (
        <p style={{ marginBottom: '1rem' }}>
          Loading todos...
        </p>
      )}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: newSortBy, sortDirection },
          })
        }
        onSortDirectionChange={(newSortDirection) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy, sortDirection: newSortDirection },
          })
        }
      />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        onUpdateTodo={updateTodo}
        onCompleteTodo={completeTodo}
        todoList={todoList}
        dataVersion={dataVersion}
      />
    </>
  );
}
export default TodosPage;