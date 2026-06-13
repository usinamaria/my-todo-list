import React from 'react';

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="filterInput" className="field-label mb-0 whitespace-nowrap">Search</label>
      <input
        id="filterInput"
        type="text"
        className="input-field"
        value={filterTerm}
        onChange={e => onFilterChange(e.target.value)}
        placeholder="Search by title..."
      />
    </div>
  );
}

export default FilterInput;
