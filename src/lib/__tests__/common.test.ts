import { describe, it, expect } from "vitest";
import { formatLabel } from "../common";

describe("formatLabel", () => {
  it("converts snake_case to Title Case", () => {
    expect(formatLabel("total_fat")).toBe("Total Fat");
    expect(formatLabel("calories_per_serving")).toBe("Calories Per Serving");
  });

  it("converts camelCase to Title Case", () => {
    expect(formatLabel("servingSize")).toBe("Serving Size");
    expect(formatLabel("totalCarbohydrates")).toBe("Total Carbohydrates");
  });

  it("capitalizes a single word", () => {
    expect(formatLabel("protein")).toBe("Protein");
  });

  it("handles already capitalized words", () => {
    expect(formatLabel("Protein")).toBe("Protein");
  });

  it("handles mixed snake_case and camelCase", () => {
    expect(formatLabel("total_bodyFat")).toBe("Total Body Fat");
  });

  it("handles numbers in keys", () => {
    expect(formatLabel("omega3fatty")).toBe("Omega3fatty");
    expect(formatLabel("vitamin_b12")).toBe("Vitamin B12");
  });

  it("returns empty string for empty input", () => {
    expect(formatLabel("")).toBe("");
  });

  it("handles single character", () => {
    expect(formatLabel("a")).toBe("A");
  });
});
