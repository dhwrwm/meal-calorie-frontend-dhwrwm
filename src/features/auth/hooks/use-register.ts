"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { ApiError } from "@/types/api-error";

interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export function useRegister() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!data?.token) {
        throw {
          error: "Register Failed",
          message: data?.message ?? "Invalid email or password",
          status_code: data?.status_code ?? 400,
        };
      }

      setToken(data.token);
      setUser(data.user);

      router.replace("/dashboard");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null) {
        const apiError = err as ApiError;

        setError({
          error: apiError.error ?? "Register Error",
          message: apiError.message ?? "Register failed",
          status_code: apiError.status_code ?? 500,
          retryAfter: apiError.retryAfter,
        });

        return;
      }

      setError({
        error: "Unknown Error",
        message: "Something went wrong",
        status_code: 500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
}
