/**
 * ProfilePage Component
 * Displays user profile information and todo statistics.
 * Uses useAuth hook to access user information.
 * Fetches and displays todo statistics from the API.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * ProfilePage - User profile page with statistics
 * @component
 * @returns {JSX.Element} User profile information and todo statistics
 */
function ProfilePage() {
  const { userName, token } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const options = {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        };

        const response = await fetch('/api/tasks', options);

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const todosResponse = await response.json();
        const todos = Array.isArray(todosResponse)
          ? todosResponse
          : todosResponse.tasks ?? [];

        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>User Profile</h1>

      <section style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Profile Information</h2>
        <div style={{ marginTop: '1rem' }}>
          <p>
            <strong>Username:</strong> {userName || 'Not available'}
          </p>
          <p>
            <strong>Status:</strong> <span style={{ color: 'green' }}>Authenticated</span>
          </p>
        </div>
      </section>

      <section style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Todo Statistics</h2>
        {isLoading ? (
          <p>Loading statistics...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
              <p>
                <strong>Total Todos:</strong> {stats.total}
              </p>
            </div>
            <div style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#c8e6c9', borderRadius: '4px' }}>
              <p>
                <strong>Completed:</strong> {stats.completed}
              </p>
            </div>
            <div style={{ padding: '0.5rem 1rem', backgroundColor: '#fff9c4', borderRadius: '4px' }}>
              <p>
                <strong>Active:</strong> {stats.active}
              </p>
            </div>
            {stats.total > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p>
                  <strong>Completion Rate:</strong> {Math.round((stats.completed / stats.total) * 100)}%
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
