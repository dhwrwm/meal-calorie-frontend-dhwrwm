import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch } from "../api";
import { useAuthStore } from "@/store/auth.store";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("@/store/auth.store", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

const logoutMock = vi.fn();
const fetchMock = vi.fn();
global.fetch = fetchMock;

const mockLocation = { replace: vi.fn() };
Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockStore = (token: string | null = "test-token") => {
  (useAuthStore.getState as any).mockReturnValue({ token, logout: logoutMock });
};

const mockResponse = (
  status: number,
  body: any,
  ok = status >= 200 && status < 300,
) => {
  fetchMock.mockResolvedValueOnce({
    status,
    ok,
    statusText: "Error",
    json: () => Promise.resolve(body),
  });
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("apiFetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore();
  });

  it("calls fetch with the correct URL and headers", async () => {
    mockResponse(200, { data: "ok" });

    await apiFetch("/api/test");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });

  it("returns parsed JSON on success", async () => {
    mockResponse(200, { dish_name: "Pizza" });

    const result = await apiFetch("/api/test");

    expect(result).toEqual({ dish_name: "Pizza" });
  });

  it("sets empty Authorization when isAuth is false", async () => {
    mockResponse(200, {});

    await apiFetch("/api/test", {}, false);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "",
        }),
      }),
    );
  });

  it("sets empty Authorization when token is null", async () => {
    mockStore(null);
    mockResponse(200, {});

    await apiFetch("/api/test");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "",
        }),
      }),
    );
  });

  it("merges custom headers with defaults", async () => {
    mockResponse(200, {});

    await apiFetch("/api/test", {
      headers: { "X-Custom-Header": "custom-value" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Custom-Header": "custom-value",
        }),
      }),
    );
  });

  it("throws formatted error on non-ok response", async () => {
    mockResponse(
      400,
      { error: "Bad Request", message: "Invalid input" },
      false,
    );

    await expect(apiFetch("/api/test")).rejects.toMatchObject({
      error: "Bad Request",
      message: "Invalid input",
      status_code: 400,
    });
  });

  it("includes retryAfter in error when present", async () => {
    mockResponse(
      429,
      { error: "Rate Limit", message: "Too many requests", retryAfter: 60 },
      false,
    );

    await expect(apiFetch("/api/test")).rejects.toMatchObject({
      status_code: 429,
      retryAfter: 60,
    });
  });

  it("falls back to default error fields when body is missing", async () => {
    fetchMock.mockResolvedValueOnce({
      status: 500,
      ok: false,
      statusText: "Internal Server Error",
      json: () => Promise.reject(new Error("no body")),
    });

    await expect(apiFetch("/api/test")).rejects.toMatchObject({
      error: "Request Failed",
      message: "Internal Server Error",
      status_code: 500,
    });
  });

  it("calls logout and redirects on 403", async () => {
    mockResponse(403, {}, false);

    await expect(apiFetch("/api/test")).rejects.toMatchObject({
      error: "Forbidden",
      status_code: 403,
    });

    expect(logoutMock).toHaveBeenCalled();
    expect(mockLocation.replace).toHaveBeenCalledWith("/login");
  });

  it("does not call logout on non-403 errors", async () => {
    mockResponse(401, { error: "Unauthorized", message: "No token" }, false);

    await expect(apiFetch("/api/test")).rejects.toMatchObject({
      status_code: 401,
    });

    expect(logoutMock).not.toHaveBeenCalled();
  });
});
