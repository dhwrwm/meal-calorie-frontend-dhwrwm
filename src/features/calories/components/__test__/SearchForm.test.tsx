import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchForm from "@/features/calories/components/SearchForm";
import toast from "react-hot-toast";
import { ApiError } from "@/types/api-error";
import { Nullable } from "@/types/common";

const renderForm = async () => {
  render(<SearchForm />);
  await act(async () => {}); // flush all pending effects
};

const defaultHook = {
  getCalories: vi.fn(),
  isLoading: false,
  result: null,
  error: null,
};

let hookResult: typeof defaultHook & {
  result?: any;
  error?: Nullable<ApiError>;
} = {
  ...defaultHook,
};
let storeSearches: any[] = [];
let searchParamsMap: Record<string, string | null> = {};

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => searchParamsMap[key] ?? null,
  }),
}));

vi.mock("@/features/calories/hooks/use-get-calories", () => ({
  useGetCalories: () => hookResult,
}));

vi.mock("@/store/meal.store", () => ({
  useMealStore: (selector: any) => selector({ searches: storeSearches }),
}));

vi.mock("react-hot-toast", () => ({
  default: { error: vi.fn() },
}));

vi.mock("@/components/common/autocomplete", () => ({
  default: ({ value, onChange, onKeyDown, placeholder }: any) => (
    <input
      data-testid="dish-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  ),
}));

vi.mock("@/components/ui/button", () => ({
  default: ({ children, onClick, isLoading, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-loading={isLoading}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  default: ({ value, onChange, ...props }: any) => (
    <input
      data-testid="serving-input"
      value={value}
      onChange={onChange}
      {...props}
    />
  ),
}));

vi.mock("@/features/calories/components/CalorieResultCard", () => ({
  default: ({ meal }: any) => (
    <div data-testid="calorie-result">{meal.dish_name}</div>
  ),
}));

vi.mock("@/features/calories/components/MealNotFound", () => ({
  default: ({ query }: any) => <div data-testid="meal-not-found">{query}</div>,
}));

vi.mock("@/components/common/rate-limit-message", () => ({
  default: ({ seconds }: any) => (
    <div data-testid="rate-limit">Rate limit: {seconds}s</div>
  ),
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("SearchForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookResult = { ...defaultHook, getCalories: vi.fn() };
    storeSearches = [];
    searchParamsMap = {};
  });

  it("renders dish input, serving input, and search button", async () => {
    await renderForm();

    expect(screen.getByTestId("dish-input")).toBeInTheDocument();
    expect(screen.getByTestId("serving-input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("shows toast error when dish name is empty on submit", async () => {
    await renderForm();

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(toast.error).toHaveBeenCalledWith("Dish name is required");
    expect(hookResult.getCalories).not.toHaveBeenCalled();
  });

  it("shows toast error when servings is 0 or less", async () => {
    await renderForm();

    fireEvent.change(screen.getByTestId("dish-input"), {
      target: { value: "Pizza" },
    });
    fireEvent.change(screen.getByTestId("serving-input"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(toast.error).toHaveBeenCalledWith("Servings must be greater than 0");
    expect(hookResult.getCalories).not.toHaveBeenCalled();
  });

  it("calls getCalories with correct values on valid submit", async () => {
    await renderForm();

    await act(async () => {
      fireEvent.change(screen.getByTestId("dish-input"), {
        target: { value: "Pizza" },
      });
      fireEvent.change(screen.getByTestId("serving-input"), {
        target: { value: "2" },
      });
      fireEvent.click(screen.getByRole("button", { name: /search/i }));
    });

    expect(hookResult.getCalories).toHaveBeenCalledWith({
      dish_name: "Pizza",
      servings: 2,
    });
  });

  it("calls getCalories on Enter key press", async () => {
    await renderForm();

    await act(async () => {
      fireEvent.change(screen.getByTestId("dish-input"), {
        target: { value: "Sushi" },
      });
      fireEvent.keyDown(screen.getByTestId("dish-input"), { key: "Enter" });
    });

    expect(hookResult.getCalories).toHaveBeenCalledWith({
      dish_name: "Sushi",
      servings: 1,
    });
  });

  it("shows loading state", async () => {
    hookResult = { ...hookResult, isLoading: true };
    await renderForm();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeDisabled();
  });

  it("shows CalorieResultCard when result is returned", async () => {
    hookResult = {
      ...hookResult,
      result: { dish_name: "Sushi", total_calories: 300 },
    };

    await renderForm();

    expect(screen.getByTestId("calorie-result")).toBeInTheDocument();
    expect(screen.getByText("Sushi")).toBeInTheDocument();
  });

  it("shows MealNotFound when 404 error", async () => {
    hookResult = {
      ...hookResult,
      error: {
        status_code: 404,
        message: "Burger not found",
        error: "Not Found",
      },
    };

    await renderForm();

    expect(screen.getByTestId("meal-not-found")).toBeInTheDocument();
  });

  it("shows RateLimitMessage when retryAfter is set", async () => {
    hookResult = {
      ...hookResult,
      error: {
        retryAfter: 30,
        error: "Rate Limit Exceeded",
        status_code: 429,
      } as any,
    };

    await renderForm();

    expect(screen.getByTestId("rate-limit")).toBeInTheDocument();
    expect(screen.getByText("Rate limit: 30s")).toBeInTheDocument();
  });

  it("auto-fetches on mount when query params are present", async () => {
    searchParamsMap = { dish_name: "Pasta", servings: "3" };

    await renderForm();

    expect(hookResult.getCalories).toHaveBeenCalledWith({
      dish_name: "Pasta",
      servings: 3,
    });
  });
});
