import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../auth.store";

const mockUser = {
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null });
  });

  it("initializes with null token and user", () => {
    const { token, user } = useAuthStore.getState();

    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  it("setToken updates the token", () => {
    useAuthStore.getState().setToken("abc123");

    expect(useAuthStore.getState().token).toBe("abc123");
  });

  it("setUser updates the user", () => {
    useAuthStore.getState().setUser(mockUser);

    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it("logout clears token and user", () => {
    useAuthStore.getState().setToken("abc123");
    useAuthStore.getState().setUser(mockUser);

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("setToken does not affect user", () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setToken("xyz789");

    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it("setUser does not affect token", () => {
    useAuthStore.getState().setToken("abc123");
    useAuthStore.getState().setUser(mockUser);

    expect(useAuthStore.getState().token).toBe("abc123");
  });
});
