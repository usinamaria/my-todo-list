/**
 * TodoForm Component
 * Form for creating new todos.
 * Implements controlled component pattern with local state management.
 */
import { useRef, useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../utils/todoValidation';
import { z } from 'zod';
import DOMPurify from 'dompurify';

/**
 * TodoForm - Form component for adding new todos
 */
function TodoForm({ onAddTodo }) {
  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [error, setError] = useState('');

  const todoSchema = z.object({
    title: z
      .string()
      .min(1, 'Todo must be at least 1 character')
      .max(200, 'Todo must be 200 characters or less')
      .refine((v) => v.trim().length > 0, 'Todo cannot be empty'),
  });

  const handleAddTodo = (event) => {
    event.preventDefault();
    setError('');

    try {
      const validated = todoSchema.parse({ title: workingTodoTitle });
      const safeTitle = DOMPurify.sanitize(validated.title);
      onAddTodo(safeTitle.trim());
      setWorkingTodoTitle('');
      inputRef.current?.focus();
    } catch (e) {
      if (e?.errors) setError(e.errors[0].message || 'Invalid todo');
      else setError('Invalid todo');
    }
  };

  return (
    <form onSubmit={handleAddTodo} className="card mb-6 p-4 sm:p-6">
      <h2 className="mb-3">Add a todo</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <TextInputWithLabel
            ref={inputRef}
            elementId="todoTitle"
            labelText="Todo"
            value={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
          />
        </div>
        <button
          disabled={!isValidTodoTitle(workingTodoTitle.trim())}
          type="submit"
          className="btn-primary"
        >
          Add Todo
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}

export default TodoForm;