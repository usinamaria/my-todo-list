import { useSearchParams } from 'react-router';

function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const handleStatusChange = (status) => {
    if (status === 'all') {
      // Remove status param for 'all' to keep URL clean
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  const options = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div role="group" aria-label="Filter todos by status" className="inline-flex flex-wrap gap-1 rounded-md border border-slate-300 bg-white p-1 shadow-sm">
      {options.map(({ value, label }) => {
        const isActive = currentStatus === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleStatusChange(value)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
              isActive
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default StatusFilter;