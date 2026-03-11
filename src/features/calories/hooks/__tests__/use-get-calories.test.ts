import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGetCalories } from "../use-get-calories";
import { useMealStore } from "@/store/meal.store";
import { apiFetch } from "@/lib/api";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("@/lib/api", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("@/store/meal.store", () => ({
  useMealStore: vi.fn(),
}));

vi.mock("@/lib/dayjs", () => {
  const mockDayjs: any = () => mockDayjs;
  mockDayjs.toISOString = vi.fn(() => "2026-03-11T00:00:00.000Z");
  return { default: mockDayjs };
});

const addSearchMock = vi.fn();
const mockUseMealStore = useMealStore as any;
const mockApiFetch = apiFetch as any;

const payload = { dish_name: "Grilled Salmon", servings: 2 };

const mockApiResponse = {
  dish_name: "Grilled Salmon",
  total_calories: 450,
  servings: 2,
  calories_per_serving: 225,
  macronutrients_per_serving: { protein: 30, carbohydrates: 0, total_fat: 15 },
  total_macronutrients: { protein: 60, carbohydrates: 0, total_fat: 30 },
  ingredient_breakdown: [],
  matched_food: { fdc_id: "171998", name: "Salmon" },
  source: "USDA",
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useGetCalories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMealStore.mockImplementation((selector: any) =>
      selector({ addSearch: addSearchMock }),
    );
  });

  it("initializes with isLoading false, no error, no result", () => {
    const { result } = renderHook(() => useGetCalories());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });

  it("sets isLoading to true while fetching", async () => {
    let resolveApi: (val: any) => void;
    mockApiFetch.mockReturnValueOnce(new Promise((res) => (resolveApi = res)));

    const { result } = renderHook(() => useGetCalories());

    act(() => {
      result.current.getCalories(payload);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => resolveApi!(mockApiResponse));
  });

  it("calls apiFetch with correct arguments", async () => {
    mockApiFetch.mockResolvedValueOnce(mockApiResponse);

    const { result } = renderHook(() => useGetCalories());
    await act(async () => result.current.getCalories(payload));

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/api/get-calories",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );
  });

  it("sets result on success", async () => {
    mockApiFetch.mockResolvedValueOnce(mockApiResponse);

    const { result } = renderHook(() => useGetCalories());
    await act(async () => result.current.getCalories(payload));

    expect(result.current.result).toEqual(mockApiResponse);
  });

  it("calls addSearch with correct data on success", async () => {
    mockApiFetch.mockResolvedValueOnce(mockApiResponse);

    const { result } = renderHook(() => useGetCalories());
    await act(async () => result.current.getCalories(payload));

    expect(addSearchMock).toHaveBeenCalledWith({
      id: "171998-2",
      dish_name: "Grilled Salmon",
      total_calories: 450,
      servings: 2,
      createdAt: "2026-03-11T00:00:00.000Z",
    });
  });

  it("sets isLoading to false after success", async () => {
    mockApiFetch.mockResolvedValueOnce(mockApiResponse);

    const { result } = renderHook(() => useGetCalories());
    await act(async () => result.current.getCalories(payload));

    expect(result.current.isLoading).toBe(false);
  });

  it("sets error when apiFetch throws an ApiError", async () => {
    mockApiFetch.mockRejectedValueOnce({
      error: "Not Found",
      message: "Meal not found",
      status_code: 404,
    });

    const { result } = renderHook(() => useGetCalories());
    await act(async () => result.current.getCalories(payload));

    expect(result.current.error).toMatchObject({
      error: "Not Found",
      message: "Meal not found",
      status_code: 404,
    });
  });

  it("sets retryAfter when present in error", async () => {
    mockApiFetch.mockRejectedValueOnce({
      error: "Rate Limit",
      message: "Too many requests",
      status_code: 429,
      retryAfter: 30,
    });

    const { result } = renderHook(() => useGetCalories());
    await act(async () => result.current.getCalories(payload));

    expect(result.current.error?.retryAfter).toBe(30);
  });

  it("sets generic error when thrown value is not an object", async () => {
    mockApiFetch.mockRejectedValueOnce("unexpected string error");

    const { result } = renderHook(() => useGetCalories());
    await act(async () => result.current.getCalories(payload));

    expect(result.current.error).toMatchObject({
      error: "Unknown Error",
      message: "Something went wrong",
      status_code: 500,
    });
  });

  it("sets isLoading to false after error", async () => {
    mockApiFetch.mockRejectedValueOnce({
      error: "Fail",
      message: "err",
      status_code: 500,
    });

    const { result } = renderHook(() => useGetCalories());
    await act(async () => result.current.getCalories(payload));

    expect(result.current.isLoading).toBe(false);
  });

  it("does not call addSearch on error", async () => {
    mockApiFetch.mockRejectedValueOnce({
      error: "Fail",
      message: "err",
      status_code: 500,
    });

    const { result } = renderHook(() => useGetCalories());
    await act(async () => result.current.getCalories(payload));

    expect(addSearchMock).not.toHaveBeenCalled();
  });

  it("clears previous error on new request", async () => {
    mockApiFetch
      .mockRejectedValueOnce({
        error: "Fail",
        message: "err",
        status_code: 500,
      })
      .mockResolvedValueOnce(mockApiResponse);

    const { result } = renderHook(() => useGetCalories());

    await act(async () => result.current.getCalories(payload));
    expect(result.current.error).not.toBeNull();

    await act(async () => result.current.getCalories(payload));
    expect(result.current.error).toBeNull();
  });

  it("clears previous result on new request error", async () => {
    mockApiFetch.mockResolvedValueOnce(mockApiResponse).mockRejectedValueOnce({
      error: "Fail",
      message: "err",
      status_code: 500,
    });

    const { result } = renderHook(() => useGetCalories());

    await act(async () => result.current.getCalories(payload));
    expect(result.current.result).not.toBeNull();

    await act(async () => result.current.getCalories(payload));
    expect(result.current.error).not.toBeNull();
  });
});
