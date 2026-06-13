import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Logoff from './Logoff.jsx';

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

const mockLogout = vi.fn(async () => ({ success: true }));
vi.mock('../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

describe('Logoff', () => {
  it('calls logout and navigates on success', async () => {
    const user = userEvent.setup();

    render(<Logoff />);

    await user.click(screen.getByRole('button', { name: /log off/i }));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});