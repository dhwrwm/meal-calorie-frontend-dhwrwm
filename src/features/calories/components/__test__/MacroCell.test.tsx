import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MacroCell from "../MacroCell";

describe("MacroCell", () => {
  it("renders value, unit, and label", () => {
    render(<MacroCell value={30} unit="g" label="Protein" color="green" />);

    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("g")).toBeInTheDocument();
    expect(screen.getByText("Protein")).toBeInTheDocument();
  });

  it.each([
    ["green", "text-primary"],
    ["orange", "text-secondary"],
    ["gray", "text-foreground"],
  ] as const)("applies correct color class for %s", (color, expectedClass) => {
    render(<MacroCell value={10} unit="g" label="Test" color={color} />);

    // the colored span contains the value
    expect(screen.getByText("10").closest("span")).toHaveClass(expectedClass);
  });

  it("applies testId when provided", () => {
    render(
      <MacroCell
        value={10}
        unit="g"
        label="Fat"
        color="gray"
        testId="macro-fat"
      />,
    );
    expect(screen.getByTestId("macro-fat")).toBeInTheDocument();
  });

  it("does not render testId attribute when not provided", () => {
    const { container } = render(
      <MacroCell value={10} unit="g" label="Fat" color="gray" />,
    );
    expect(container.firstChild).not.toHaveAttribute("data-testid");
  });
});
