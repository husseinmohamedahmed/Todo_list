import React, { useState, useEffect, useCallback } from "react";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import TodoFilter from "./components/TodoFilter";
import {
  createTodo,
  filterTodos,
  toggleTodo,
  deleteTodo,
  editTodo,
  setPriority,
  clearCompleted,
  countActive,
  isValidText,
  sortTodos,
} from "./todoUtils";
import "./App.css";

const STORAGE_KEY = "todo_app_todos";

/**
 * Root application component.
 * Manages global todo state and persists it to localStorage.
 */
const App = () => {
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // storage unavailable
    }
  }, [todos]);

  const handleAdd = useCallback((text) => {
    if (!isValidText(text)) return;
    setTodos((prev) => [...prev, createTodo(text)]);
  }, []);

  const handleToggle = useCallback((id) => {
    setTodos((prev) => toggleTodo(prev, id));
  }, []);

  const handleDelete = useCallback((id) => {
    setTodos((prev) => deleteTodo(prev, id));
  }, []);

  const handleEdit = useCallback((id, newText) => {
    if (!isValidText(newText)) return;
    setTodos((prev) => editTodo(prev, id, newText));
  }, []);

  const handlePriorityChange = useCallback((id, priority) => {
    setTodos((prev) => setPriority(prev, id, priority));
  }, []);

  const handleClearCompleted = useCallback(() => {
    setTodos((prev) => clearCompleted(prev));
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  const visibleTodos = sortTodos(filterTodos(todos, filter));
  const activeCount = countActive(todos);

  return (
    <div className="app" data-testid="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-accent">✓</span> TodoFlow
        </h1>
        <p className="app-subtitle">Stay focused. Get things done.</p>
      </header>

      <main className="app-main">
        <TodoInput onAdd={handleAdd} />

        {todos.length > 0 && (
          <TodoFilter
            currentFilter={filter}
            onFilterChange={handleFilterChange}
            activeCount={activeCount}
            onClearCompleted={handleClearCompleted}
            totalCount={todos.length}
          />
        )}

        <div className="todo-list" data-testid="todo-list">
          {visibleTodos.length === 0 ? (
            <div className="empty-state" data-testid="empty-state">
              {filter === "all"
                ? "No tasks yet — add one above!"
                : `No ${filter} tasks.`}
            </div>
          ) : (
            visibleTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onPriorityChange={handlePriorityChange}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
