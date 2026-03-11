// __tests__/RecentSearchCard.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MealSearch } from "@/types/meal";
import dayjs from "@/lib/dayjs";
import RecentSearchCard from "../RecentSearchCard";

// Mock Card to simplify test (optional)
vi.mock("@/components/common/card", () => ({
  Card: ({
    children,
    className,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => <div className={className}>{children}</div>,
}));

describe("RecentSearchCard", () => {
  const item: MealSearch = {
    id: "1",
    dish_name: "Grilled Chicken",
    servings: 2,
    total_calories: 450.7,
    createdAt: new Date().toISOString(),
  };

  it("renders dish name, servings, and calories", () => {
    render(<RecentSearchCard item={item} />);

    // Dish name
    expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();

    // Servings
    expect(screen.getByText(/2 servings/i)).toBeInTheDocument();

    // Calories (rounded)
    expect(screen.getByText("451")).toBeInTheDocument();
    expect(screen.getByText(/kcal/i)).toBeInTheDocument();
  });

  it("renders a Link with correct href", () => {
    render(<RecentSearchCard item={item} />);
    const link = screen.getByRole("link") as HTMLAnchorElement;
    expect(link).toHaveAttribute(
      "href",
      `/calories?dish_name=${encodeURIComponent(item.dish_name)}&servings=${item.servings}`,
    );
  });

  it("shows relative time using dayjs", () => {
    render(<RecentSearchCard item={item} />);
    const relativeTime = dayjs(item.createdAt).fromNow();
    expect(screen.getByText(new RegExp(relativeTime, "i"))).toBeInTheDocument();
  });
});
