import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoInput from "../components/TodoInput";

const renderInput = (onAdd = jest.fn()) =>
  render(<TodoInput onAdd={onAdd} />);

describe("TodoInput rendering", () => {
  it("renders the input field", () => {
    renderInput();
    expect(screen.getByTestId("todo-input")).toBeInTheDocument();
  });

  it("renders the add button", () => {
    renderInput();
    expect(screen.getByTestId("add-btn")).toBeInTheDocument();
  });

  it("add button is disabled when input is empty", () => {
    renderInput();
    expect(screen.getByTestId("add-btn")).toBeDisabled();
  });

  it("add button is enabled when input has text", () => {
    renderInput();
    fireEvent.change(screen.getByTestId("todo-input"), {
      target: { value: "Some task" },
    });
    expect(screen.getByTestId("add-btn")).not.toBeDisabled();
  });

  it("add button is disabled for whitespace-only input", () => {
    renderInput();
    fireEvent.change(screen.getByTestId("todo-input"), {
      target: { value: "   " },
    });
    expect(screen.getByTestId("add-btn")).toBeDisabled();
  });
});

describe("TodoInput adding todos", () => {
  it("calls onAdd with trimmed text when button clicked", () => {
    const onAdd = jest.fn();
    renderInput(onAdd);
    fireEvent.change(screen.getByTestId("todo-input"), {
      target: { value: "  Buy milk  " },
    });
    fireEvent.click(screen.getByTestId("add-btn"));
    expect(onAdd).toHaveBeenCalledWith("Buy milk");
  });

  it("clears input after adding", () => {
    renderInput();
    const input = screen.getByTestId("todo-input");
    fireEvent.change(input, { target: { value: "Task" } });
    fireEvent.click(screen.getByTestId("add-btn"));
    expect(input).toHaveValue("");
  });

  it("calls onAdd when Enter key is pressed", () => {
    const onAdd = jest.fn();
    renderInput(onAdd);
    const input = screen.getByTestId("todo-input");
    fireEvent.change(input, { target: { value: "New task" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onAdd).toHaveBeenCalledWith("New task");
  });

  it("does not call onAdd when input is empty and Enter pressed", () => {
    const onAdd = jest.fn();
    renderInput(onAdd);
    fireEvent.keyDown(screen.getByTestId("todo-input"), { key: "Enter" });
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("does not call onAdd when other keys are pressed", () => {
    const onAdd = jest.fn();
    renderInput(onAdd);
    const input = screen.getByTestId("todo-input");
    fireEvent.change(input, { target: { value: "task" } });
    fireEvent.keyDown(input, { key: "Tab" });
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("does not call onAdd when button clicked with whitespace only", () => {
    const onAdd = jest.fn();
    renderInput(onAdd);
    fireEvent.change(screen.getByTestId("todo-input"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByTestId("add-btn"));
    expect(onAdd).not.toHaveBeenCalled();
  });
});
