import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from './TodoForm.jsx';

describe('TodoForm', () => {
  it('calls onAddTodo with sanitized trimmed value', async () => {
    const user = userEvent.setup();
    const onAddTodo = vi.fn();

    render(<TodoForm onAddTodo={onAddTodo} />);

    const input = screen.getByLabelText(/todo/i);
    const button = screen.getByRole('button', { name: /add todo/i });

    await user.type(input, '  Hello <script>bad()</script>  ');
    await user.click(button);

    expect(onAddTodo).toHaveBeenCalledTimes(1);
    const sent = onAddTodo.mock.calls[0][0];
    // sanitized content should not contain <script> tags
    expect(sent).not.toMatch(/<script>/i);
    expect(sent).toContain('Hello');
  });
});
