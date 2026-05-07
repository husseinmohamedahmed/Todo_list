import React, { useState } from "react";
import PropTypes from "prop-types";
// Sprint 2 - TodoItem component with priority levels by [Mariam]
const TodoItem = ({ todo, onToggle, onDelete, onEdit, onPriorityChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEditSubmit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const priorityColors = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  };

  return (
    <div
      className={`todo-item ${todo.completed ? "completed" : ""} priority-${todo.priority}`}
      data-testid="todo-item"
    >
      <button
        className="toggle-btn"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        data-testid="toggle-btn"
      >
        {todo.completed ? (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#7c3aed" />
            <path
              d="M8 12l3 3 5-5"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="2"
            />
          </svg>
        )}
      </button>

      <span
        className="priority-dot"
        style={{ background: priorityColors[todo.priority] }}
        aria-label={`Priority: ${todo.priority}`}
        data-testid="priority-dot"
      />

      {isEditing ? (
        <input
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          data-testid="edit-input"
          aria-label="Edit todo text"
        />
      ) : (
        <button
          type="button"
          className="todo-text-btn"
          onDoubleClick={() => setIsEditing(true)}
          data-testid="todo-text"
          aria-label={`Todo: ${todo.text}. Double-click to edit.`}
        >
          {todo.text}
        </button>
      )}

      <div className="todo-actions">
        <select
          className="priority-select"
          value={todo.priority}
          onChange={(e) => onPriorityChange(todo.id, e.target.value)}
          aria-label="Set priority"
          data-testid="priority-select"
        >
          <option value="high">High</option>
          <option value="medium">Med</option>
          <option value="low">Low</option>
        </select>

        {!isEditing && (
          <button
            className="edit-btn"
            onClick={() => setIsEditing(true)}
            aria-label="Edit todo"
            data-testid="edit-btn"
          >
            ✏️
          </button>
        )}

        <button
          className="delete-btn"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
          data-testid="delete-btn"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    priority: PropTypes.oneOf(["high", "medium", "low"]).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPriorityChange: PropTypes.func.isRequired,
};

export default TodoItem;
