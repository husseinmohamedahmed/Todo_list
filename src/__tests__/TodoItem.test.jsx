import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "../components/TodoItem";

const baseTodo = {
  id: "1",
  text: "Buy groceries",
  completed: false,
  priority: "medium",
  createdAt: new Date().toISOString(),
};

const renderItem = (overrides = {}, handlers = {}) => {
  const props = {
    todo: { ...baseTodo, ...overrides },
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
    onPriorityChange: jest.fn(),
    ...handlers,
  };
  return { ...render(<TodoItem {...props} />), ...props };
};

// ─── Rendering ────────────────────────────────────────────────
describe("TodoItem rendering", () => {
  it("renders todo text", () => {
    renderItem();
    expect(screen.getByTestId("todo-text")).toHaveTextContent("Buy groceries");
  });

  it("renders incomplete toggle button with circle icon", () => {
    renderItem();
    expect(screen.getByTestId("toggle-btn")).toBeInTheDocument();
  });

  it("renders completed toggle with filled icon when completed", () => {
    renderItem({ completed: true });
    expect(screen.getByTestId("todo-item")).toHaveClass("completed");
  });

  it("applies correct priority class", () => {
    renderItem({ priority: "high" });
    expect(screen.getByTestId("todo-item")).toHaveClass("priority-high");
  });

  it("applies medium priority class", () => {
    renderItem({ priority: "medium" });
    expect(screen.getByTestId("todo-item")).toHaveClass("priority-medium");
  });

  it("applies low priority class", () => {
    renderItem({ priority: "low" });
    expect(screen.getByTestId("todo-item")).toHaveClass("priority-low");
  });

  it("renders priority dot with correct aria-label", () => {
    renderItem({ priority: "high" });
    expect(screen.getByLabelText("Priority: high")).toBeInTheDocument();
  });

  it("renders delete button", () => {
    renderItem();
    expect(screen.getByTestId("delete-btn")).toBeInTheDocument();
  });

  it("renders edit button", () => {
    renderItem();
    expect(screen.getByTestId("edit-btn")).toBeInTheDocument();
  });

  it("renders priority select with correct value", () => {
    renderItem({ priority: "high" });
    expect(screen.getByTestId("priority-select")).toHaveValue("high");
  });
});

// ─── Toggle ───────────────────────────────────────────────────
describe("TodoItem toggle", () => {
  it("calls onToggle with todo id when toggle button clicked", () => {
    const { onToggle } = renderItem();
    fireEvent.click(screen.getByTestId("toggle-btn"));
    expect(onToggle).toHaveBeenCalledWith("1");
  });

  it("toggle button has accessible aria-label for incomplete", () => {
    renderItem({ completed: false });
    expect(screen.getByLabelText("Mark as complete")).toBeInTheDocument();
  });

  it("toggle button has accessible aria-label for completed", () => {
    renderItem({ completed: true });
    expect(screen.getByLabelText("Mark as incomplete")).toBeInTheDocument();
  });
});

// ─── Delete ───────────────────────────────────────────────────
describe("TodoItem delete", () => {
  it("calls onDelete with todo id when delete button clicked", () => {
    const { onDelete } = renderItem();
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});

// ─── Edit ─────────────────────────────────────────────────────
describe("TodoItem editing", () => {
  it("enters edit mode on edit button click", () => {
    renderItem();
    fireEvent.click(screen.getByTestId("edit-btn"));
    expect(screen.getByTestId("edit-input")).toBeInTheDocument();
  });

  it("enters edit mode on double click of text", () => {
    renderItem();
    fireEvent.doubleClick(screen.getByTestId("todo-text"));
    expect(screen.getByTestId("edit-input")).toBeInTheDocument();
  });

  it("hides edit button while editing", () => {
    renderItem();
    fireEvent.click(screen.getByTestId("edit-btn"));
    expect(screen.queryByTestId("edit-btn")).not.toBeInTheDocument();
  });

  it("calls onEdit with new text on Enter key", () => {
    const { onEdit } = renderItem();
    fireEvent.click(screen.getByTestId("edit-btn"));
    const input = screen.getByTestId("edit-input");
    fireEvent.change(input, { target: { value: "Updated task" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onEdit).toHaveBeenCalledWith("1", "Updated task");
  });

  it("calls onEdit on blur", () => {
    const { onEdit } = renderItem();
    fireEvent.click(screen.getByTestId("edit-btn"));
    const input = screen.getByTestId("edit-input");
    fireEvent.change(input, { target: { value: "Blurred task" } });
    fireEvent.blur(input);
    expect(onEdit).toHaveBeenCalledWith("1", "Blurred task");
  });

  it("cancels edit on Escape key and restores original text", () => {
    const { onEdit } = renderItem();
    fireEvent.click(screen.getByTestId("edit-btn"));
    const input = screen.getByTestId("edit-input");
    fireEvent.change(input, { target: { value: "Changed" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByTestId("todo-text")).toHaveTextContent("Buy groceries");
  });

  it("does not call onEdit if text is unchanged", () => {
    const { onEdit } = renderItem();
    fireEvent.click(screen.getByTestId("edit-btn"));
    const input = screen.getByTestId("edit-input");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("does not call onEdit if text is empty/whitespace", () => {
    const { onEdit } = renderItem();
    fireEvent.click(screen.getByTestId("edit-btn"));
    const input = screen.getByTestId("edit-input");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onEdit).not.toHaveBeenCalled();
  });
});

// ─── Priority Change ──────────────────────────────────────────
describe("TodoItem priority change", () => {
  it("calls onPriorityChange when select changes", () => {
    const { onPriorityChange } = renderItem();
    fireEvent.change(screen.getByTestId("priority-select"), {
      target: { value: "high" },
    });
    expect(onPriorityChange).toHaveBeenCalledWith("1", "high");
  });

  it("can change to low priority", () => {
    const { onPriorityChange } = renderItem();
    fireEvent.change(screen.getByTestId("priority-select"), {
      target: { value: "low" },
    });
    expect(onPriorityChange).toHaveBeenCalledWith("1", "low");
  });
});
