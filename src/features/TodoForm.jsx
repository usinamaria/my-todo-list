import { useRef } from 'react';
import { useState } from 'react';

function TodoForm({ onAddTodo }) {
    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

const handleAddTodo = (event) => {
  event.preventDefault();

  const todoTitle = workingTodoTitle.trim();
  if (todoTitle) {
    onAddTodo(todoTitle);
    setWorkingTodoTitle('');
    inputRef.current.focus();
  }
};
return (
  <form onSubmit={handleAddTodo}>
    <label htmlFor="todoTitle">Todo</label>
    <input
      ref={inputRef}
      type="text"
      id="todoTitle"
      name="todoTitle"
      placeholder={'Todo text'}
      value={workingTodoTitle}
      onChange={(event) => setWorkingTodoTitle(event.target.value)}
      required
    />
    <button disabled={!workingTodoTitle.trim()} type="submit">
      Add Todo
    </button>
  </form>
);
}

export default TodoForm;