import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "@/store/auth.store";
import { apiFetch } from "@/lib/api";
import { useLogin } from "../use-login";

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

const payload = { email: "john@example.com", password: "password123" };

const mockData = {
  token: "abc123",
  user: { first_name: "John", last_name: "Doe", email: "john@example.com" },
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockImplementation((selector: any) =>
      selector({ setToken: setTokenMock, setUser: setUserMock }),
    );
  });

  it("initializes with isLoading false and no error", () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets isLoading to true while logging in", async () => {
    let resolveApi: (val: any) => void;
    mockApiFetch.mockReturnValueOnce(new Promise((res) => (resolveApi = res)));

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.login(payload);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => resolveApi!(mockData));
  });

  it("calls apiFetch with correct arguments", async () => {
    mockApiFetch.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useLogin());
    await act(async () => result.current.login(payload));

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );
  });

  it("calls setToken and setUser on success", async () => {
    mockApiFetch.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useLogin());
    await act(async () => result.current.login(payload));

    expect(setTokenMock).toHaveBeenCalledWith("abc123");
    expect(setUserMock).toHaveBeenCalledWith(mockData.user);
  });

  it("redirects to /dashboard on success", async () => {
    mockApiFetch.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useLogin());
    await act(async () => result.current.login(payload));

    expect(replaceMock).toHaveBeenCalledWith("/dashboard");
  });

  it("sets isLoading to false after success", async () => {
    mockApiFetch.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useLogin());
    await act(async () => result.current.login(payload));

    expect(result.current.isLoading).toBe(false);
  });

  it("sets error when token is missing in response", async () => {
    mockApiFetch.mockResolvedValueOnce({
      token: null,
      message: "Invalid credentials",
    });

    const { result } = renderHook(() => useLogin());
    await act(async () => result.current.login(payload));

    expect(result.current.error).toMatchObject({
      error: "Login Failed",
      message: "Invalid credentials",
      status_code: 400,
    });
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("sets error when apiFetch throws an ApiError", async () => {
    mockApiFetch.mockRejectedValueOnce({
      error: "Unauthorized",
      message: "Wrong password",
      status_code: 401,
    });

    const { result } = renderHook(() => useLogin());
    await act(async () => result.current.login(payload));

    expect(result.current.error).toMatchObject({
      error: "Unauthorized",
      message: "Wrong password",
      status_code: 401,
    });
  });

  it("sets retryAfter when present in error", async () => {
    mockApiFetch.mockRejectedValueOnce({
      error: "Rate Limit",
      message: "Too many requests",
      status_code: 429,
      retryAfter: 60,
    });

    const { result } = renderHook(() => useLogin());
    await act(async () => result.current.login(payload));

    expect(result.current.error?.retryAfter).toBe(60);
  });

  it("sets generic error when thrown value is not an object", async () => {
    mockApiFetch.mockRejectedValueOnce("unexpected string error");

    const { result } = renderHook(() => useLogin());
    await act(async () => result.current.login(payload));

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

    const { result } = renderHook(() => useLogin());
    await act(async () => result.current.login(payload));

    expect(result.current.isLoading).toBe(false);
  });

  it("clears previous error on new login attempt", async () => {
    mockApiFetch
      .mockRejectedValueOnce({
        error: "Fail",
        message: "err",
        status_code: 500,
      })
      .mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useLogin());

    await act(async () => result.current.login(payload));
    expect(result.current.error).not.toBeNull();

    await act(async () => result.current.login(payload));
    expect(result.current.error).toBeNull();
  });
});
