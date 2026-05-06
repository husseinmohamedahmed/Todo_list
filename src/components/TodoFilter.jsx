import React from "react";
import PropTypes from "prop-types";

// Sprint 2 - Filter component: All, Active, Completed by [Aya]

const FILTERS = ["all", "active", "completed"];

const TodoFilter = ({ currentFilter, onFilterChange, activeCount, onClearCompleted, totalCount }) => (
  <div className="todo-filter" data-testid="todo-filter">
    <span className="active-count" data-testid="active-count">
      {activeCount} item{activeCount !== 1 ? "s" : ""} left
    </span>

    <div className="filter-tabs" role="tablist" aria-label="Filter todos">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          role="tab"
          aria-selected={currentFilter === filter}
          className={`filter-tab ${currentFilter === filter ? "active" : ""}`}
          onClick={() => onFilterChange(filter)}
          data-testid={`filter-${filter}`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>

    {totalCount > activeCount && (
      <button
        className="clear-completed-btn"
        onClick={onClearCompleted}
        data-testid="clear-completed-btn"
      >
        Clear completed
      </button>
    )}
  </div>
);

TodoFilter.propTypes = {
  currentFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  activeCount: PropTypes.number.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default TodoFilter;
