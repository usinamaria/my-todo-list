import React from 'react';

function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <div>
        <label htmlFor="sort-by-select">Sort by:</label>{' '}
        <select
          id="sort-by-select"
          value={sortBy}
          onChange={e => onSortByChange(e.target.value)}
        >
          <option value="creationDate">Creation Date</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div>
        <label htmlFor="sort-direction-select">Order:</label>{' '}
        <select
          id="sort-direction-select"
          value={sortDirection}
          onChange={e => onSortDirectionChange(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}

export default SortBy;
