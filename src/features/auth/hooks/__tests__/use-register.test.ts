import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRegister } from "../use-register";
import { useAuthStore } from "@/store/auth.store";
import { apiFetch } from "@/lib/api";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@/lib/api", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("@/store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

const setTokenMock = vi.fn();
const setUserMock = vi.fn();
const mockUseAuthStore = useAuthStore as any;
const mockApiFetch = apiFetch as any;

const payload = {
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  password: "password123",
};

const mockData = {
  token: "abc123",
  user: { first_name: "John", last_name: "Doe", email: "john@example.com" },
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useRegister", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockImplementation((selector: any) =>
      selector({ setToken: setTokenMock, setUser: setUserMock }),
    );
  });

  it("initializes with isLoading false and no error", () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets isLoading to true while registering", async () => {
    let resolveApi: (val: any) => void;
    mockApiFetch.mockReturnValueOnce(new Promise((res) => (resolveApi = res)));

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.register(payload);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => resolveApi!(mockData));
  });

  it("calls apiFetch with correct arguments", async () => {
    mockApiFetch.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useRegister());
    await act(async () => result.current.register(payload));

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );
  });

  it("calls setToken and setUser on success", async () => {
    mockApiFetch.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useRegister());
    await act(async () => result.current.register(payload));

    expect(setTokenMock).toHaveBeenCalledWith("abc123");
    expect(setUserMock).toHaveBeenCalledWith(mockData.user);
  });

  it("redirects to /dashboard on success", async () => {
    mockApiFetch.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useRegister());
    await act(async () => result.current.register(payload));

    expect(replaceMock).toHaveBeenCalledWith("/dashboard");
  });

  it("sets isLoading to false after success", async () => {
    mockApiFetch.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useRegister());
    await act(async () => result.current.register(payload));

    expect(result.current.isLoading).toBe(false);
  });

  it("sets error when token is missing in response", async () => {
    mockApiFetch.mockResolvedValueOnce({
      token: null,
      message: "Email already exists",
    });

    const { result } = renderHook(() => useRegister());
    await act(async () => result.current.register(payload));

    expect(result.current.error).toMatchObject({
      error: "Register Failed",
      message: "Email already exists",
      status_code: 400,
    });
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("sets error when apiFetch throws an ApiError", async () => {
    mockApiFetch.mockRejectedValueOnce({
      error: "Conflict",
      message: "Email already in use",
      status_code: 409,
    });

    const { result } = renderHook(() => useRegister());
    await act(async () => result.current.register(payload));

    expect(result.current.error).toMatchObject({
      error: "Conflict",
      message: "Email already in use",
      status_code: 409,
    });
  });

  it("sets retryAfter when present in error", async () => {
    mockApiFetch.mockRejectedValueOnce({
      error: "Rate Limit",
      message: "Too many requests",
      status_code: 429,
      retryAfter: 60,
    });

    const { result } = renderHook(() => useRegister());
    await act(async () => result.current.register(payload));

    expect(result.current.error?.retryAfter).toBe(60);
  });

  it("sets generic error when thrown value is not an object", async () => {
    mockApiFetch.mockRejectedValueOnce("unexpected string error");

    const { result } = renderHook(() => useRegister());
    await act(async () => result.current.register(payload));

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

    const { result } = renderHook(() => useRegister());
    await act(async () => result.current.register(payload));

    expect(result.current.isLoading).toBe(false);
  });

  it("clears previous error on new register attempt", async () => {
    mockApiFetch
      .mockRejectedValueOnce({
        error: "Fail",
        message: "err",
        status_code: 500,
      })
      .mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useRegister());

    await act(async () => result.current.register(payload));
    expect(result.current.error).not.toBeNull();

    await act(async () => result.current.register(payload));
    expect(result.current.error).toBeNull();
  });

  it("does not call setToken or redirect when error occurs", async () => {
    mockApiFetch.mockRejectedValueOnce({
      error: "Server Error",
      message: "Something broke",
      status_code: 500,
    });

    const { result } = renderHook(() => useRegister());
    await act(async () => result.current.register(payload));

    expect(setTokenMock).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
