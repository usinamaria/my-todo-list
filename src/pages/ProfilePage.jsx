/**
 * ProfilePage Component
 * Displays user profile information and todo statistics.
 * Uses useAuth hook to access user information.
 * Fetches and displays todo statistics from the API.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';
import { SESSION_EXPIRED_MESSAGE, getFetchErrorMessage } from '../utils/errorMessages.js';

function ProfilePage() {
  const { userName, token } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
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
        const options = { method: 'GET', headers: { 'X-CSRF-TOKEN': token }, credentials: 'include' };

        const firstResponse = await fetch('/api/tasks?page=1', options);
        if (firstResponse.status === 401) throw new Error(SESSION_EXPIRED_MESSAGE);
        if (!firstResponse.ok) throw new Error("We couldn't load your todo statistics. Please try again later.");
        const firstData = await firstResponse.json();
        const todos = Array.isArray(firstData) ? firstData : [...(firstData.tasks ?? [])];

        const totalPages = firstData.pagination?.pages ?? 1;
        for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
          const response = await fetch(`/api/tasks?page=${pageNum}`, options);
          if (!response.ok) throw new Error("We couldn't load your todo statistics. Please try again later.");
          const data = await response.json();
          todos.push(...(data.tasks ?? []));
        }

        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;
        setStats({ total, completed, active });
      } catch (err) {
        setError(getFetchErrorMessage(err, err.message));
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodoStats();
  }, [token]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1>User Profile</h1>

      <section className="card p-4 sm:p-6">
        <h2 className="mb-4">Profile Information</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <dt className="font-semibold text-slate-700">Username:</dt>
            <dd className="text-slate-600">{userName || 'Not available'}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="font-semibold text-slate-700">Status:</dt>
            <dd>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-800">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
                Authenticated
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="card p-4 sm:p-6">
        <h2 className="mb-4">Todo Statistics</h2>
        {isLoading ? (
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <LoadingSpinner />
            Loading statistics...
          </div>
        ) : error ? (
          <div className="alert-error">
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-primary-50 p-3 text-center">
                <p className="text-2xl font-bold text-primary-700">{stats.total}</p>
                <p className="text-xs font-medium text-primary-700/80">Total</p>
              </div>
              <div className="rounded-md bg-accent-50 p-3 text-center">
                <p className="text-2xl font-bold text-accent-700">{stats.completed}</p>
                <p className="text-xs font-medium text-accent-700/80">Completed</p>
              </div>
              <div className="rounded-md bg-amber-50 p-3 text-center">
                <p className="text-2xl font-bold text-amber-700">{stats.active}</p>
                <p className="text-xs font-medium text-amber-700/80">Active</p>
              </div>
            </div>
            {stats.total > 0 && (
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Completion Rate:</span>{' '}
                {Math.round((stats.completed / stats.total) * 100)}%
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
