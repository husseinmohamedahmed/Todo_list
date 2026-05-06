export const generateId = () =>
  `todo_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
// Sprint 1 - Utility functions: createTodo, toggleTodo, deleteTodo by [Wafaa]
export const createTodo = (text) => ({
  id: generateId(),
  text: text.trim(),
  completed: false,
  createdAt: new Date().toISOString(),
  priority: "medium",
});

export const filterTodos = (todos, filter) => {
  switch (filter) {
    case "active":
      return todos.filter((t) => !t.completed);
    case "completed":
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
};

export const toggleTodo = (todos, id) =>
  todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );

export const deleteTodo = (todos, id) => todos.filter((todo) => todo.id !== id);

export const editTodo = (todos, id, newText) =>
  todos.map((todo) =>
    todo.id === id ? { ...todo, text: newText.trim() } : todo,
  );

export const setPriority = (todos, id, priority) =>
  todos.map((todo) => (todo.id === id ? { ...todo, priority } : todo));

export const clearCompleted = (todos) => todos.filter((t) => !t.completed);

export const countActive = (todos) => todos.filter((t) => !t.completed).length;

export const isValidText = (text) =>
  typeof text === "string" && text.trim().length > 0;

export const sortTodos = (todos) => {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
  });
};
