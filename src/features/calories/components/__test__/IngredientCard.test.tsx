import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import IngredientCard from "../IngredientCard";
import { Ingredient } from "@/types/meal";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const fullIngredient: Ingredient = {
  name: "Chicken Breast",
  calories_per_100g: 165,
  serving_size: "100g",
  data_type: "SR Legacy",
  brand: "Generic",
  fdc_id: "171477",
  macronutrients_per_100g: {
    protein: 31,
    total_fat: 3.6,
    carbohydrates: 0,
    saturated_fat: 1.01,
  },
} as any;

const minimalIngredient: Ingredient = {
  name: "Plain Rice",
  calories_per_100g: 130,
  macronutrients_per_100g: {},
} as any;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("IngredientCard", () => {
  it("renders ingredient name and calories", () => {
    render(<IngredientCard ing={fullIngredient} />);

    expect(screen.getByText("Chicken Breast")).toBeInTheDocument();
    expect(screen.getByText("165 kcal")).toBeInTheDocument();
    expect(screen.getByText("per 100g")).toBeInTheDocument();
  });

  it("renders serving size badge when present", () => {
    render(<IngredientCard ing={fullIngredient} />);
    expect(screen.getByText(/🥄 100g/)).toBeInTheDocument();
  });

  it("renders data_type badge when present", () => {
    render(<IngredientCard ing={fullIngredient} />);
    expect(screen.getByText("SR Legacy")).toBeInTheDocument();
  });

  it("renders brand badge when present", () => {
    render(<IngredientCard ing={fullIngredient} />);
    expect(screen.getByText(/🏷️ Generic/)).toBeInTheDocument();
  });

  it("renders fdc_id badge when present", () => {
    render(<IngredientCard ing={fullIngredient} />);
    expect(screen.getByText("FDC #171477")).toBeInTheDocument();
  });

  it("does not render optional badges when fields are missing", () => {
    render(<IngredientCard ing={minimalIngredient} />);

    expect(screen.queryByText(/🥄/)).not.toBeInTheDocument();
    expect(screen.queryByText(/🏷️/)).not.toBeInTheDocument();
    expect(screen.queryByText(/FDC #/)).not.toBeInTheDocument();
  });

  it("renders macro values formatted to 1 decimal place", () => {
    render(<IngredientCard ing={fullIngredient} />);

    expect(screen.getByText("31.0g")).toBeInTheDocument(); // protein
    expect(screen.getByText("3.6g")).toBeInTheDocument(); // fat
    expect(screen.getByText("0.0g")).toBeInTheDocument(); // carbs
    expect(screen.getByText("1.0g")).toBeInTheDocument(); // sat fat
  });

  it("renders — for missing macro values", () => {
    render(<IngredientCard ing={minimalIngredient} />);

    const dashes = screen.getAllByText("—");
    expect(dashes).toHaveLength(4);
  });

  it("renders all macro labels", () => {
    render(<IngredientCard ing={fullIngredient} />);

    expect(screen.getByText("Protein")).toBeInTheDocument();
    expect(screen.getByText("Fat")).toBeInTheDocument();
    expect(screen.getByText("Carbs")).toBeInTheDocument();
    expect(screen.getByText("Sat.Fat")).toBeInTheDocument();
  });

  it("applies testId when provided", () => {
    render(<IngredientCard ing={fullIngredient} testId="my-ingredient" />);
    expect(screen.getByTestId("my-ingredient")).toBeInTheDocument();
  });

  it("does not render testId attribute when not provided", () => {
    const { container } = render(<IngredientCard ing={fullIngredient} />);
    expect(container.firstChild).not.toHaveAttribute("data-testid");
  });
});
