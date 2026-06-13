import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Logon from './Logon.jsx';

const mockLogin = vi.fn(async () => ({ success: true }));

vi.mock('../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe('Logon', () => {
  it('submits login with entered credentials', async () => {
    const user = userEvent.setup();

    render(<Logon />);

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'pass');
    await user.click(screen.getByRole('button', { name: /log on/i }));

    expect(mockLogin).toHaveBeenCalledWith('a@b.com', 'pass');
  });
});