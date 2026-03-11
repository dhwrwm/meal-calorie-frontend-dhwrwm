import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MealNotFound from "../MealNotFound";

vi.mock("@/components/common/card", () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

describe("MealNotFound", () => {
  it("renders the emoji icons", () => {
    render(<MealNotFound />);
    expect(screen.getByText("🍽️")).toBeInTheDocument();
    expect(screen.getByText("⚠️")).toBeInTheDocument();
  });

  it("renders fallback text when query is not provided", () => {
    render(<MealNotFound />);
    expect(screen.getByText("Dish not found")).toBeInTheDocument();
  });

  it("renders the query when provided", () => {
    render(<MealNotFound query="Unicorn Steak" />);
    expect(screen.getByText("Unicorn Steak")).toBeInTheDocument();
  });

  it("does not render fallback text when query is provided", () => {
    render(<MealNotFound query="Unicorn Steak" />);
    expect(screen.queryByText("Dish not found")).not.toBeInTheDocument();
  });

  it("renders the data-testid on the card", () => {
    render(<MealNotFound />);
    expect(screen.getByTestId("meal-not-found")).toBeInTheDocument();
  });
});
