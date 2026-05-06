import React, { useState } from "react";
import PropTypes from "prop-types";

const TodoInput = ({ onAdd }) => {
  const [text, setText] = useState("");

  const isValid = text.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) {
      onAdd(trimmed);
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="todo-input-wrapper" data-testid="todo-input-wrapper">
      <input
        className="todo-input"
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="New todo input"
        data-testid="todo-input"
      />
      <button
        className="add-btn"
        onClick={handleSubmit}
        aria-label="Add todo"
        data-testid="add-btn"
        disabled={!isValid}
      >
        Add
      </button>
    </div>
  );
};

TodoInput.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default TodoInput;
