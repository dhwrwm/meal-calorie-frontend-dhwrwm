import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RecentSearches from "../RecentSearches";
import { useMealStore } from "@/store/meal.store";

vi.mock("@/store/meal.store", () => ({
  useMealStore: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("../RecentSearchCard", () => ({
  default: ({ item }: any) => (
    <div data-testid="recent-search-card">{item.dish_name}</div>
  ),
}));

const mockUseMealStore = useMealStore as unknown as ReturnType<typeof vi.fn>;

const mockMeals = [
  {
    id: "1",
    dish_name: "Grilled Chicken",
    servings: 2,
    total_calories: 450,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    dish_name: "Caesar Salad",
    servings: 1,
    total_calories: 200,
    createdAt: new Date().toISOString(),
  },
];

describe("RecentSearches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading and Search New link", () => {
    mockUseMealStore.mockImplementation((selector: any) =>
      selector({ searches: [] }),
    );

    render(<RecentSearches />);

    expect(screen.getByText("Recent Searches")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /search new/i })).toHaveAttribute(
      "href",
      "/calories",
    );
  });

  it("shows empty state when no searches", () => {
    mockUseMealStore.mockImplementation((selector: any) => {
      return selector({ searches: [] });
    });

    render(<RecentSearches />);

    expect(
      screen.getByText(/haven't searched for any meals yet/i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("recent-search-card")).not.toBeInTheDocument();
  });

  it("renders a card for each search item", () => {
    mockUseMealStore.mockImplementation((selector: any) =>
      selector({ searches: mockMeals }),
    );

    render(<RecentSearches />);

    const cards = screen.getAllByTestId("recent-search-card");
    expect(cards).toHaveLength(2);
    expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();
    expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
  });
});
