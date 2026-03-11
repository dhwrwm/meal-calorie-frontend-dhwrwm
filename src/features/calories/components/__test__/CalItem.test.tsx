import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CalItem from "../CalItem";

describe("CalItem", () => {
  it("renders value and label", () => {
    render(<CalItem value={450} label="Calories" color="orange" />);

    expect(screen.getByText("450")).toBeInTheDocument();
    expect(screen.getByText("Calories")).toBeInTheDocument();
  });

  it.each([
    ["orange", "text-secondary"],
    ["green", "text-primary"],
    ["dark", "text-foreground"],
  ] as const)("applies correct color class for %s", (color, expectedClass) => {
    render(<CalItem value={100} label="Test" color={color} />);

    expect(screen.getByText("100")).toHaveClass(expectedClass);
  });

  it("applies border and layout classes to the wrapper", () => {
    const { container } = render(
      <CalItem value={1} label="Test" color="dark" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex-1", "flex", "flex-col", "items-center");
  });
});
