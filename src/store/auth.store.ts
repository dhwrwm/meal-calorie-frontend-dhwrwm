import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserPayload {
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: UserPayload | null;
  setToken: (token: string) => void;
  setUser: (user: UserPayload) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setToken: (token) => {
        set({ token });
      },

      setUser: (user) => {
        set({ user });
      },

      logout: () =>
        set({
          token: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
