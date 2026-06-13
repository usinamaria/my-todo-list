import { render, screen } from '@testing-library/react';
import TodoList from './TodoList.jsx';

describe('TodoList', () => {
  it('renders list of todos', () => {
    const todos = [
      { id: 1, title: 'A', isCompleted: false },
      { id: 2, title: 'B', isCompleted: false },
    ];
    render(<ul><TodoList todoList={todos} onCompleteTodo={vi.fn()} onUpdateTodo={vi.fn()} /></ul>);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
