import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "../App";
// Sprint 3 - Integration tests for App component by [Lydia]
// ─── localStorage mock ────────────────────────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] ?? null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const addTodo = (text) => {
  fireEvent.change(screen.getByTestId("todo-input"), { target: { value: text } });
  fireEvent.click(screen.getByTestId("add-btn"));
};

beforeEach(() => {
  localStorageMock.clear();
  localStorageMock.getItem.mockReturnValue(null);
});

// ─── App Shell ────────────────────────────────────────────────
describe("App rendering", () => {
  it("renders the app title", () => {
    render(<App />);
    expect(screen.getByText(/TodoFlow/i)).toBeInTheDocument();
  });

  it("renders the input field", () => {
    render(<App />);
    expect(screen.getByTestId("todo-input")).toBeInTheDocument();
  });

  it("shows empty state when no todos", () => {
    render(<App />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("does not render filter bar when no todos", () => {
    render(<App />);
    expect(screen.queryByTestId("todo-filter")).not.toBeInTheDocument();
  });
});

// ─── Adding Todos ─────────────────────────────────────────────
describe("App - adding todos", () => {
  it("adds a todo item to the list", () => {
    render(<App />);
    addTodo("Walk the dog");
    expect(screen.getByText("Walk the dog")).toBeInTheDocument();
  });

  it("clears input after adding", () => {
    render(<App />);
    addTodo("Clean house");
    expect(screen.getByTestId("todo-input")).toHaveValue("");
  });

  it("shows the filter bar after first todo is added", () => {
    render(<App />);
    addTodo("First task");
    expect(screen.getByTestId("todo-filter")).toBeInTheDocument();
  });

  it("does not add a todo with empty input", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("todo-input"), { target: { value: "" } });
    fireEvent.click(screen.getByTestId("add-btn"));
    expect(screen.queryByTestId("todo-item")).not.toBeInTheDocument();
  });

  it("does not add a todo with whitespace only", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("todo-input"), { target: { value: "   " } });
    fireEvent.click(screen.getByTestId("add-btn"));
    expect(screen.queryByTestId("todo-item")).not.toBeInTheDocument();
  });

  it("saves todos to localStorage after adding", () => {
    render(<App />);
    addTodo("Persist me");
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});

// ─── Toggling Todos ───────────────────────────────────────────
describe("App - toggling todos", () => {
  it("marks a todo as completed when toggle clicked", () => {
    render(<App />);
    addTodo("Exercise");
    fireEvent.click(screen.getByTestId("toggle-btn"));
    expect(screen.getByTestId("todo-item")).toHaveClass("completed");
  });

  it("marks a completed todo as incomplete when toggled again", () => {
    render(<App />);
    addTodo("Exercise");
    fireEvent.click(screen.getByTestId("toggle-btn"));
    fireEvent.click(screen.getByTestId("toggle-btn"));
    expect(screen.getByTestId("todo-item")).not.toHaveClass("completed");
  });
});

// ─── Deleting Todos ───────────────────────────────────────────
describe("App - deleting todos", () => {
  it("removes a todo when delete button clicked", () => {
    render(<App />);
    addTodo("Delete me");
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
  });

  it("shows empty state after all todos deleted", () => {
    render(<App />);
    addTodo("Solo task");
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });
});

// ─── Editing Todos ────────────────────────────────────────────
describe("App - editing todos", () => {
  it("edits a todo text", () => {
    render(<App />);
    addTodo("Old text");
    fireEvent.click(screen.getByTestId("edit-btn"));
    const input = screen.getByTestId("edit-input");
    fireEvent.change(input, { target: { value: "New text" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("New text")).toBeInTheDocument();
  });

  it("does not edit if text is whitespace", () => {
    render(<App />);
    addTodo("Keep me");
    fireEvent.click(screen.getByTestId("edit-btn"));
    const input = screen.getByTestId("edit-input");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("Keep me")).toBeInTheDocument();
  });
});

// ─── Priority ─────────────────────────────────────────────────
describe("App - priority", () => {
  it("changes todo priority", () => {
    render(<App />);
    addTodo("Priority task");
    fireEvent.change(screen.getByTestId("priority-select"), {
      target: { value: "high" },
    });
    expect(screen.getByTestId("priority-select")).toHaveValue("high");
  });
});

// ─── Filtering ────────────────────────────────────────────────
describe("App - filtering", () => {
  it("filters to show only active todos", () => {
    render(<App />);
    addTodo("Active task");
    addTodo("Completed task");
    fireEvent.click(screen.getAllByTestId("toggle-btn")[1]);
    fireEvent.click(screen.getByTestId("filter-active"));
    expect(screen.queryByText("Completed task")).not.toBeInTheDocument();
    expect(screen.getByText("Active task")).toBeInTheDocument();
  });

  it("filters to show only completed todos", () => {
    render(<App />);
    addTodo("Active task");
    addTodo("Completed task");
    fireEvent.click(screen.getAllByTestId("toggle-btn")[1]);
    fireEvent.click(screen.getByTestId("filter-completed"));
    expect(screen.queryByText("Active task")).not.toBeInTheDocument();
    expect(screen.getByText("Completed task")).toBeInTheDocument();
  });

  it("shows 'No active tasks' empty state when no active todos", () => {
    render(<App />);
    addTodo("Done task");
    fireEvent.click(screen.getByTestId("toggle-btn"));
    fireEvent.click(screen.getByTestId("filter-active"));
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("No active tasks");
  });

  it("shows 'No completed tasks' empty state when no completed todos", () => {
    render(<App />);
    addTodo("Active task");
    fireEvent.click(screen.getByTestId("filter-completed"));
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("No completed tasks");
  });

  it("switches back to all filter", () => {
    render(<App />);
    addTodo("Task");
    fireEvent.click(screen.getByTestId("filter-active"));
    fireEvent.click(screen.getByTestId("filter-all"));
    expect(screen.getByText("Task")).toBeInTheDocument();
  });
});

// ─── Clear Completed ──────────────────────────────────────────
describe("App - clear completed", () => {
  it("clears all completed todos", () => {
    render(<App />);
    addTodo("Keep");
    addTodo("Remove");
    fireEvent.click(screen.getAllByTestId("toggle-btn")[1]);
    fireEvent.click(screen.getByTestId("clear-completed-btn"));
    expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    expect(screen.getByText("Keep")).toBeInTheDocument();
  });
});

// ─── localStorage ─────────────────────────────────────────────
describe("App - localStorage", () => {
  it("loads todos from localStorage on mount", () => {
    const stored = JSON.stringify([
      {
        id: "abc",
        text: "Stored task",
        completed: false,
        priority: "medium",
        createdAt: new Date().toISOString(),
      },
    ]);
    localStorageMock.getItem.mockReturnValueOnce(stored);
    render(<App />);
    expect(screen.getByText("Stored task")).toBeInTheDocument();
  });

  it("handles localStorage setItem failure gracefully", () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error("QuotaExceededError");
    });
    render(<App />);
    expect(() => {
      addTodo("Trigger setItem");
    }).not.toThrow();
  });
});
