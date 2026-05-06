import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoFilter from "../components/TodoFilter";

const renderFilter = (props = {}) => {
  const defaults = {
    currentFilter: "all",
    onFilterChange: jest.fn(),
    activeCount: 3,
    onClearCompleted: jest.fn(),
    totalCount: 5,
  };
  return render(<TodoFilter {...defaults} {...props} />);
};

describe("TodoFilter rendering", () => {
  it("renders the filter bar", () => {
    renderFilter();
    expect(screen.getByTestId("todo-filter")).toBeInTheDocument();
  });

  it("shows correct active count", () => {
    renderFilter({ activeCount: 2 });
    expect(screen.getByTestId("active-count")).toHaveTextContent("2 items left");
  });

  it("shows singular 'item' when count is 1", () => {
    renderFilter({ activeCount: 1 });
    expect(screen.getByTestId("active-count")).toHaveTextContent("1 item left");
  });

  it("renders all three filter tabs", () => {
    renderFilter();
    expect(screen.getByTestId("filter-all")).toBeInTheDocument();
    expect(screen.getByTestId("filter-active")).toBeInTheDocument();
    expect(screen.getByTestId("filter-completed")).toBeInTheDocument();
  });

  it("marks the current filter tab as active", () => {
    renderFilter({ currentFilter: "active" });
    expect(screen.getByTestId("filter-active")).toHaveClass("active");
    expect(screen.getByTestId("filter-all")).not.toHaveClass("active");
  });

  it("shows clear completed button when completed todos exist", () => {
    renderFilter({ totalCount: 5, activeCount: 3 });
    expect(screen.getByTestId("clear-completed-btn")).toBeInTheDocument();
  });

  it("hides clear completed button when all todos are active", () => {
    renderFilter({ totalCount: 3, activeCount: 3 });
    expect(screen.queryByTestId("clear-completed-btn")).not.toBeInTheDocument();
  });
});

describe("TodoFilter interactions", () => {
  it("calls onFilterChange with 'all' when All tab clicked", () => {
    const onFilterChange = jest.fn();
    renderFilter({ onFilterChange });
    fireEvent.click(screen.getByTestId("filter-all"));
    expect(onFilterChange).toHaveBeenCalledWith("all");
  });

  it("calls onFilterChange with 'active' when Active tab clicked", () => {
    const onFilterChange = jest.fn();
    renderFilter({ onFilterChange });
    fireEvent.click(screen.getByTestId("filter-active"));
    expect(onFilterChange).toHaveBeenCalledWith("active");
  });

  it("calls onFilterChange with 'completed' when Completed tab clicked", () => {
    const onFilterChange = jest.fn();
    renderFilter({ onFilterChange });
    fireEvent.click(screen.getByTestId("filter-completed"));
    expect(onFilterChange).toHaveBeenCalledWith("completed");
  });

  it("calls onClearCompleted when clear completed button is clicked", () => {
    const onClearCompleted = jest.fn();
    renderFilter({ onClearCompleted });
    fireEvent.click(screen.getByTestId("clear-completed-btn"));
    expect(onClearCompleted).toHaveBeenCalled();
  });
});
