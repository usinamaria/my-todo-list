/**
 * TodosPage Component
 * Container component that manages all todo-related state and functions.
 * Handles todo CRUD operations (Create, Read, Update, Delete/Complete).
 */
import { useState, useEffect } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';

/**
 * TodosPage - Main feature page for todo management
 * @component
 * @param {Object} props - Component props
 * @param {string} props.token - CSRF token for authenticated requests
 * @returns {JSX.Element} Todo form and list components
 */
function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  

  useEffect(() => {
    async function fetchTodos() {
      try {
        setIsTodoListLoading(true);

        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setTodoList(data.tasks ?? []);
        } else if (response.status === 401) {
          throw new Error('unauthorized');
        } else {
          throw new Error('Failed to fetch todos.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token]);

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
      {isTodoListLoading && (
        <p style={{ marginBottom: '1rem' }}>
          Loading todos...
        </p>
      )}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        onUpdateTodo={updateTodo}
        onCompleteTodo={completeTodo}
        todoList={todoList}
      />
    </>
  );
}
export default TodosPage;