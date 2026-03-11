import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuthStore } from "@/store/auth.store";
import { useAuthGuard } from "../use-auth-guard";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@/store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

const mockUseAuthStore = useAuthStore as any;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useAuthGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true when token exists", () => {
    mockUseAuthStore.mockImplementation((selector: any) =>
      selector({ token: "abc123" }),
    );

    const { result } = renderHook(() => useAuthGuard());

    expect(result.current).toBe(true);
  });

  it("returns false when token is null", () => {
    mockUseAuthStore.mockImplementation((selector: any) =>
      selector({ token: null }),
    );

    const { result } = renderHook(() => useAuthGuard());

    expect(result.current).toBe(false);
  });

  it("redirects to /login when token is null", () => {
    mockUseAuthStore.mockImplementation((selector: any) =>
      selector({ token: null }),
    );

    renderHook(() => useAuthGuard());

    expect(replaceMock).toHaveBeenCalledWith("/login");
  });

  it("does not redirect when token exists", () => {
    mockUseAuthStore.mockImplementation((selector: any) =>
      selector({ token: "abc123" }),
    );

    renderHook(() => useAuthGuard());

    expect(replaceMock).not.toHaveBeenCalled();
  });
});
