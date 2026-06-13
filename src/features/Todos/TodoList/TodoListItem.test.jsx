import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoListItem from './TodoListItem.jsx';

describe('TodoListItem', () => {
  it('calls onCompleteTodo when checkbox toggled', async () => {
    const user = userEvent.setup();
    const todo = { id: 1, title: 'Test', isCompleted: false };
    const onCompleteTodo = vi.fn();
    const onUpdateTodo = vi.fn();

    render(<ul><TodoListItem todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo} /></ul>);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(onCompleteTodo).toHaveBeenCalledWith(1);
  });

  it('allows editing and calls onUpdateTodo', async () => {
    const user = userEvent.setup();
    const todo = { id: 2, title: 'Edit me', isCompleted: false };
    const onCompleteTodo = vi.fn();
    const onUpdateTodo = vi.fn();

    render(<ul><TodoListItem todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo} /></ul>);

    const title = screen.getByText(/edit me/i);
    await user.click(title);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Edited');

    const updateButton = screen.getByRole('button', { name: /update/i });
    await user.click(updateButton);

    expect(onUpdateTodo).toHaveBeenCalled();
  });
});
