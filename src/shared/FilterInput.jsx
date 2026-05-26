import React from 'react';

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="filterInput">Search todos:</label>{' '}
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={e => onFilterChange(e.target.value)}
        placeholder="Search by title..."
      />
    </div>
  );
}

export default FilterInput;
