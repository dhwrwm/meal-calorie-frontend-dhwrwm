import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CalorieResultCard from "../CalorieResultCard";
import { Meal } from "@/types/meal";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("@/components/common/card", () => ({
  Card: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock("./CalItem", () => ({
  default: ({ value, label }: any) => (
    <div data-testid={`cal-item-${label.replace(/\s/g, "-").toLowerCase()}`}>
      {value} {label}
    </div>
  ),
}));

vi.mock("./MacroCell", () => ({
  default: ({ value, label }: any) => (
    <div data-testid={`macro-${label.toLowerCase()}`}>
      {value} {label}
    </div>
  ),
}));

vi.mock("./IngredientCard", () => ({
  default: ({ ing }: any) => (
    <div data-testid="ingredient-card">{ing.name}</div>
  ),
}));

vi.mock("@/lib/fonts", () => ({
  playfairDisplay: { className: "playfairDisplay" },
}));

vi.mock("@/lib/common", () => ({
  formatLabel: (label: string) => label,
}));

// ─── Fixture ─────────────────────────────────────────────────────────────────

const mockMeal: Meal = {
  dish_name: "Grilled Salmon",
  total_calories: 450.5,
  calories_per_serving: 225.25,
  servings: 2,
  macronutrients_per_serving: {
    protein: 30,
    carbohydrates: 10,
    total_fat: 15,
    fiber: 2,
    sugar: 1,
  },
  total_macronutrients: {
    protein: 60,
    carbohydrates: 20,
    total_fat: 30,
    fiber: 4,
    sugar: 2,
  },
  ingredient_breakdown: [{ name: "Salmon fillet" }, { name: "Olive oil" }],
  matched_food: {
    name: "Atlantic Salmon",
    brand: "Generic",
  },
  source: "USDA",
} as any;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("CalorieResultCard", () => {
  it("renders dish name", () => {
    render(<CalorieResultCard meal={mockMeal} />);
    expect(screen.getByText("Grilled Salmon")).toBeInTheDocument();
  });

  it("renders servings and total calories summary", () => {
    render(<CalorieResultCard meal={mockMeal} />);
    expect(screen.getByText(/2 servings/)).toBeInTheDocument();
    expect(screen.getByText(/450.50 kcal/)).toBeInTheDocument();
  });

  it("renders CalItem for calories per serving, total calories, and servings", () => {
    render(<CalorieResultCard meal={mockMeal} />);
    expect(screen.getByTestId("cal-item-cal-/-serving")).toBeInTheDocument();
    expect(screen.getByTestId("cal-item-total-calories")).toBeInTheDocument();
    expect(screen.getByTestId("cal-item-servings")).toBeInTheDocument();
  });

  it("renders MacroCell for protein, carbs, and fat", () => {
    render(<CalorieResultCard meal={mockMeal} />);
    expect(screen.getByTestId("macro-protein")).toBeInTheDocument();
    expect(screen.getByTestId("macro-carbs")).toBeInTheDocument();
    expect(screen.getByTestId("macro-fat")).toBeInTheDocument();
  });

  it("shows per serving nutrients by default", () => {
    render(<CalorieResultCard meal={mockMeal} />);
    expect(screen.getByText(/30g/)).toBeInTheDocument(); // per serving protein
  });

  it("switches to total nutrients on tab click", () => {
    render(<CalorieResultCard meal={mockMeal} />);

    fireEvent.click(screen.getByRole("button", { name: /total/i }));

    expect(screen.getByText(/60g/)).toBeInTheDocument(); // total protein
  });

  it("highlights the active tab", () => {
    render(<CalorieResultCard meal={mockMeal} />);

    const perButton = screen.getByRole("button", { name: /per serving/i });
    const totalButton = screen.getByRole("button", { name: /total/i });

    expect(perButton).toHaveClass("bg-card");
    expect(totalButton).not.toHaveClass("bg-card");

    fireEvent.click(totalButton);

    expect(totalButton).toHaveClass("bg-card");
    expect(perButton).not.toHaveClass("bg-card");
  });

  it("renders ingredient breakdown when present", () => {
    render(<CalorieResultCard meal={mockMeal} />);

    const cards = screen.getAllByTestId("ingredient-card");
    expect(cards).toHaveLength(2);
    expect(screen.getByText("Salmon fillet")).toBeInTheDocument();
    expect(screen.getByText("Olive oil")).toBeInTheDocument();
  });

  it("does not render ingredient breakdown when empty", () => {
    render(
      <CalorieResultCard meal={{ ...mockMeal, ingredient_breakdown: [] }} />,
    );
    expect(screen.queryByTestId("ingredient-card")).not.toBeInTheDocument();
  });

  it("renders matched food record entries", () => {
    render(<CalorieResultCard meal={mockMeal} />);
    expect(screen.getByText("Atlantic Salmon")).toBeInTheDocument();
    expect(screen.getByText("Generic")).toBeInTheDocument();
  });

  it("renders source", () => {
    render(<CalorieResultCard meal={mockMeal} />);
    expect(screen.getByText(/Source: USDA/)).toBeInTheDocument();
  });

  it("renders N/A when source is missing", () => {
    render(<CalorieResultCard meal={{ ...mockMeal, source: "" }} />);
    expect(screen.getByText(/Source: N\/A/)).toBeInTheDocument();
  });
});
