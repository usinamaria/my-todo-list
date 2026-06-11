import React from 'react';

function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="sort-by-select" className="field-label mb-0 whitespace-nowrap">Sort by</label>
        <select
          id="sort-by-select"
          className="select-field"
          value={sortBy}
          onChange={e => onSortByChange(e.target.value)}
        >
          <option value="createdDate">Creation Date</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sort-direction-select" className="field-label mb-0 whitespace-nowrap">Order</label>
        <select
          id="sort-direction-select"
          className="select-field"
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
