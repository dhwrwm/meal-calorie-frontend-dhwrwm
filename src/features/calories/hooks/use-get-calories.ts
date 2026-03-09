"use client";

import { ApiError } from "@/types/api-error";
import { useState } from "react";
import { useMealStore } from "@/store/meal.store";
import { Meal } from "@/types/meal";
import { apiFetch } from "@/lib/api";
import dayjs from "@/lib/dayjs";

export function useGetCalories() {
  const addSearch = useMealStore((s) => s.addSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<Meal | null>(null);

  const getCalories = async (payload: {
    dish_name: string;
    servings: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiFetch("/api/get-calories", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      addSearch({
        id: `${data.matched_food.fdc_id}-${data.servings}`,
        dish_name: data.dish_name,
        total_calories: data.total_calories,
        servings: data.servings,
        createdAt: dayjs().toISOString(),
      });

      setResult(data);
      setIsLoading(false);
    } catch (err: unknown) {
      console.log({ err });

      if (typeof err === "object" && err !== null) {
        const apiError = err as ApiError;

        setError({
          error: apiError.error ?? "Search Error",
          message: apiError.message ?? "Search failed",
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
    getCalories,
    isLoading,
    error,
    result,
  };
}
