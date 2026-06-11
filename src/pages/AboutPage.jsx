/**
 * AboutPage Component
 * Displays information about the todo application.
 * Provides details about app features and technologies used.
 */

/**
 * AboutPage - Application information page
 * @component
 * @returns {JSX.Element} About page content
 */
function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1>About My Todo List</h1>

      <section className="card p-4 sm:p-6">
        <h2 className="mb-3">Features</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700">
          <li>Add new todos, with input validation and sanitization</li>
          <li>Edit existing todo titles inline</li>
          <li>Mark todos as complete</li>
          <li>Filter todos by status: All, Active, or Completed</li>
          <li>Search todos by title, with debounced input for fewer requests</li>
          <li>Sort todos by creation date or title, ascending or descending</li>
          <li>View todo statistics and completion rate on the Profile page</li>
          <li>User authentication with protected Todos and Profile routes</li>
          <li>Persistent storage via a REST API backend</li>
          <li>Optimistic UI updates with automatic rollback if a request fails</li>
        </ul>
      </section>

      <section className="card p-4 sm:p-6">
        <h2 className="mb-3">Technologies Used</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700">
          <li><strong className="font-semibold text-slate-900">React</strong> - JavaScript library for building user interfaces</li>
          <li><strong className="font-semibold text-slate-900">React Router</strong> - Client-side routing for single-page applications</li>
          <li><strong className="font-semibold text-slate-900">Vite</strong> - Fast and modern build tool for web applications</li>
          <li><strong className="font-semibold text-slate-900">Tailwind CSS</strong> - Utility-first styling and design system</li>
          <li><strong className="font-semibold text-slate-900">Context API</strong> - State management for authentication</li>
          <li><strong className="font-semibold text-slate-900">Hooks</strong> - useReducer, useEffect, useState, useId, and custom hooks for component logic</li>
          <li><strong className="font-semibold text-slate-900">Zod &amp; DOMPurify</strong> - Input validation and sanitization</li>
          <li><strong className="font-semibold text-slate-900">Express</strong> - Backend REST API with Helmet and rate limiting</li>
        </ul>
      </section>

      <section className="card p-4 sm:p-6">
        <h2 className="mb-3">Architecture</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          This application follows modern React patterns with component-based architecture,
          context-based state management for authentication, and reducer patterns for complex
          todo list state management. Routes are protected and redirect unauthenticated users
          to the login page.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;
