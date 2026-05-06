import {
  generateId,
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
} from "../todoUtils";

// ─── generateId ───────────────────────────────────────────────
describe("generateId", () => {
  it("returns a string", () => {
    expect(typeof generateId()).toBe("string");
  });

  it("starts with 'todo_'", () => {
    expect(generateId()).toMatch(/^todo_/);
  });

  it("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, generateId));
    expect(ids.size).toBe(100);
  });
});

// ─── createTodo ───────────────────────────────────────────────
describe("createTodo", () => {
  it("creates a todo with correct shape", () => {
    const todo = createTodo("Buy milk");
    expect(todo).toMatchObject({
      text: "Buy milk",
      completed: false,
      priority: "medium",
    });
    expect(todo.id).toBeDefined();
    expect(todo.createdAt).toBeDefined();
  });

  it("trims whitespace from text", () => {
    const todo = createTodo("  hello  ");
    expect(todo.text).toBe("hello");
  });

  it("has a valid ISO date string", () => {
    const todo = createTodo("test");
    expect(() => new Date(todo.createdAt)).not.toThrow();
  });
});

// ─── filterTodos ──────────────────────────────────────────────
describe("filterTodos", () => {
  const todos = [
    { id: "1", text: "A", completed: false },
    { id: "2", text: "B", completed: true },
    { id: "3", text: "C", completed: false },
  ];

  it("returns all todos for filter 'all'", () => {
    expect(filterTodos(todos, "all")).toHaveLength(3);
  });

  it("returns only active todos for filter 'active'", () => {
    const result = filterTodos(todos, "active");
    expect(result).toHaveLength(2);
    expect(result.every((t) => !t.completed)).toBe(true);
  });

  it("returns only completed todos for filter 'completed'", () => {
    const result = filterTodos(todos, "completed");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("defaults to returning all todos for unknown filter", () => {
    expect(filterTodos(todos, "unknown")).toHaveLength(3);
  });

  it("handles empty array", () => {
    expect(filterTodos([], "active")).toHaveLength(0);
  });
});

// ─── toggleTodo ───────────────────────────────────────────────
describe("toggleTodo", () => {
  const todos = [
    { id: "1", completed: false },
    { id: "2", completed: true },
  ];

  it("toggles a false todo to true", () => {
    const result = toggleTodo(todos, "1");
    expect(result.find((t) => t.id === "1").completed).toBe(true);
  });

  it("toggles a true todo to false", () => {
    const result = toggleTodo(todos, "2");
    expect(result.find((t) => t.id === "2").completed).toBe(false);
  });

  it("does not mutate other todos", () => {
    const result = toggleTodo(todos, "1");
    expect(result.find((t) => t.id === "2").completed).toBe(true);
  });

  it("returns a new array (immutable)", () => {
    const result = toggleTodo(todos, "1");
    expect(result).not.toBe(todos);
  });

  it("leaves todos unchanged if id not found", () => {
    const result = toggleTodo(todos, "999");
    expect(result[0].completed).toBe(false);
    expect(result[1].completed).toBe(true);
  });
});

// ─── deleteTodo ───────────────────────────────────────────────
describe("deleteTodo", () => {
  const todos = [
    { id: "1", text: "A" },
    { id: "2", text: "B" },
  ];

  it("removes the todo with the given id", () => {
    const result = deleteTodo(todos, "1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("returns a new array", () => {
    expect(deleteTodo(todos, "1")).not.toBe(todos);
  });

  it("returns all todos if id not found", () => {
    expect(deleteTodo(todos, "999")).toHaveLength(2);
  });

  it("handles empty array", () => {
    expect(deleteTodo([], "1")).toHaveLength(0);
  });
});

// ─── editTodo ─────────────────────────────────────────────────
describe("editTodo", () => {
  const todos = [{ id: "1", text: "Old text" }];

  it("updates text of the matching todo", () => {
    const result = editTodo(todos, "1", "New text");
    expect(result[0].text).toBe("New text");
  });

  it("trims whitespace", () => {
    const result = editTodo(todos, "1", "  trimmed  ");
    expect(result[0].text).toBe("trimmed");
  });

  it("does not change other todos", () => {
    const multiTodos = [
      { id: "1", text: "A" },
      { id: "2", text: "B" },
    ];
    const result = editTodo(multiTodos, "1", "AA");
    expect(result[1].text).toBe("B");
  });

  it("returns a new array", () => {
    expect(editTodo(todos, "1", "X")).not.toBe(todos);
  });
});

// ─── setPriority ──────────────────────────────────────────────
describe("setPriority", () => {
  const todos = [{ id: "1", priority: "medium" }];

  it("sets priority to high", () => {
    expect(setPriority(todos, "1", "high")[0].priority).toBe("high");
  });

  it("sets priority to low", () => {
    expect(setPriority(todos, "1", "low")[0].priority).toBe("low");
  });

  it("does not change other todos", () => {
    const multi = [
      { id: "1", priority: "medium" },
      { id: "2", priority: "medium" },
    ];
    const result = setPriority(multi, "1", "high");
    expect(result[1].priority).toBe("medium");
  });
});

// ─── clearCompleted ───────────────────────────────────────────
describe("clearCompleted", () => {
  it("removes completed todos", () => {
    const todos = [
      { id: "1", completed: false },
      { id: "2", completed: true },
      { id: "3", completed: true },
    ];
    const result = clearCompleted(todos);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("returns all if none completed", () => {
    const todos = [{ id: "1", completed: false }];
    expect(clearCompleted(todos)).toHaveLength(1);
  });

  it("returns empty array if all completed", () => {
    const todos = [{ id: "1", completed: true }];
    expect(clearCompleted(todos)).toHaveLength(0);
  });
});

// ─── countActive ──────────────────────────────────────────────
describe("countActive", () => {
  it("counts only incomplete todos", () => {
    const todos = [
      { completed: false },
      { completed: true },
      { completed: false },
    ];
    expect(countActive(todos)).toBe(2);
  });

  it("returns 0 if all completed", () => {
    expect(countActive([{ completed: true }])).toBe(0);
  });

  it("returns 0 for empty array", () => {
    expect(countActive([])).toBe(0);
  });
});

// ─── isValidText ──────────────────────────────────────────────
describe("isValidText", () => {
  it("returns true for non-empty strings", () => {
    expect(isValidText("hello")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(isValidText("")).toBe(false);
  });

  it("returns false for whitespace only", () => {
    expect(isValidText("   ")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isValidText(null)).toBe(false);
    expect(isValidText(undefined)).toBe(false);
    expect(isValidText(123)).toBe(false);
  });
});

// ─── sortTodos ────────────────────────────────────────────────
describe("sortTodos", () => {
  it("puts incomplete todos before completed", () => {
    const todos = [
      { id: "1", completed: true, priority: "high" },
      { id: "2", completed: false, priority: "high" },
    ];
    const result = sortTodos(todos);
    expect(result[0].id).toBe("2");
  });

  it("sorts by priority within same completed status (high > medium > low)", () => {
    const todos = [
      { id: "1", completed: false, priority: "low" },
      { id: "2", completed: false, priority: "high" },
      { id: "3", completed: false, priority: "medium" },
    ];
    const result = sortTodos(todos);
    expect(result[0].id).toBe("2");
    expect(result[1].id).toBe("3");
    expect(result[2].id).toBe("1");
  });

  it("does not mutate the original array", () => {
    const todos = [{ id: "1", completed: false, priority: "low" }];
    const result = sortTodos(todos);
    expect(result).not.toBe(todos);
  });

  it("handles todos with undefined priority gracefully", () => {
    const todos = [
      { id: "1", completed: false, priority: undefined },
      { id: "2", completed: false, priority: "high" },
    ];
    expect(() => sortTodos(todos)).not.toThrow();
  });

  it("handles empty array", () => {
    expect(sortTodos([])).toHaveLength(0);
  });
});
