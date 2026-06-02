/**
 * TodosPage Component
 * Container component that manages all todo-related state and functions.
 * Handles todo CRUD operations (Create, Read, Update, Delete/Complete).
 */
import { useState, useEffect, useCallback } from 'react';
import useDebounce from '../../utils/useDebounce.js';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';

/**
 * TodosPage - Main feature page for todo management
 * @component
 * @param {Object} props - Component props
 * @param {string} props.token - CSRF token for authenticated requests
 * @returns {JSX.Element} Todo form and list components
 */
function TodosPage({ token }) {
  const [filterError, setFilterError] = useState('');
  const [dataVersion, setDataVersion] = useState(0);
  const invalidateCache = useCallback(() => {
    setDataVersion(prev => prev + 1);
  }, []);
  const handleFilterChange = (newTerm) => {
      setFilterTerm(newTerm);
    };
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState('creationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  

  useEffect(() => {
    async function fetchTodos() {
      try {
        setIsTodoListLoading(true);

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
          setTodoList(data.tasks ?? []);
          setFilterError('');
        } else if (response.status === 401) {
          throw new Error('unauthorized');
        } else {
          throw new Error('Failed to fetch todos.');
        }
      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
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

    setTodoList(prev => [newTodo, ...prev]);

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

      setTodoList(prev =>
        prev.map(todo =>
          todo.id === newTodo.id ? data : todo
        )
      );
      invalidateCache();
    } catch (err) {
      setTodoList(prev =>
        prev.filter(todo => todo.id !== newTodo.id)
      );

      setError('Unable to add todo.');
    }
  }

  // -----------------------------
  // UPDATE TODO (Optimistic)
  // -----------------------------
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      todo => todo.id === editedTodo.id
    );

    setTodoList(prev =>
      prev.map(todo =>
        todo.id === editedTodo.id ? editedTodo : todo
      )
    );

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
      invalidateCache();
    } catch (err) {
      setTodoList(prev =>
        prev.map(todo =>
          todo.id === originalTodo.id ? originalTodo : todo
        )
      );

      setError('Unable to update todo.');
    }
  }

  // -----------------------------
  // COMPLETE TODO (Optimistic)
  // -----------------------------
  async function completeTodo(id) {
    const originalTodo = todoList.find(todo => todo.id === id);

    const completedTodo = {
      ...originalTodo,
      isCompleted: true,
    };

    setTodoList(prev =>
      prev.map(todo =>
        todo.id === id ? completedTodo : todo
      )
    );

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
      invalidateCache();
    } catch (err) {
      setTodoList(prev =>
        prev.map(todo =>
          todo.id === originalTodo.id ? originalTodo : todo
        )
      );

      setError('Unable to complete todo.');
    }
  }
  return (
    <>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          <p>{error}</p>
          <button onClick={() => setError('')}>Clear Error</button>
        </div>
      )}
      {filterError && (
        <div style={{ color: 'orange', marginBottom: '1rem' }}>
          <p>{filterError}</p>
          <button onClick={() => setFilterError('')}>Clear Filter Error</button>{' '}
          <button
            onClick={() => {
              setFilterTerm('');
              setSortBy('creationDate');
              setSortDirection('desc');
              setFilterError('');
            }}
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
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
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