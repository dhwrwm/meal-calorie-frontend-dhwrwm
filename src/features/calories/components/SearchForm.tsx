"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { useGetCalories } from "../hooks/use-get-calories";
import CalorieResultCard from "./CalorieResultCard";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import RateLimitMessage from "@/components/common/rate-limit-message";
import MealNotFound from "./MealNotFound";
import Autocomplete from "@/components/common/autocomplete";
import { useMealStore } from "@/store/meal.store";
import toast from "react-hot-toast";

export default function SearchForm() {
  const searchParams = useSearchParams();
  const dishName = searchParams.get("dish_name");
  const servings = searchParams.get("servings");
  const history = useMealStore((s) => s.searches);
  const [dishNameValue, setDishNameValue] = useState<string>(dishName ?? "");
  const [servingCount, setServingCount] = useState<string>(servings ?? "1");
  const { getCalories, isLoading, result, error } = useGetCalories();

  const dropdownOptions = useMemo(
    () =>
      history.map((item) => ({
        label: item.dish_name,
        value: item.dish_name,
      })),
    [history],
  );

  const onSelect = useCallback((option: { label: string; value: string }) => {
    setDishNameValue(option.value);
  }, []);

  const onChangeDishName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setDishNameValue(value);
    },
    [],
  );

  const onChangeServingCount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setServingCount(value);
    },
    [],
  );

  const onSubmit = useCallback(() => {
    if (dishNameValue.trim() === "") {
      toast.error("Dish name is required");
      return;
    }

    if (Number(servingCount) <= 0) {
      toast.error("Servings must be greater than 0");
      return;
    }

    getCalories({
      dish_name: dishNameValue,
      servings: Number(servingCount),
    });
  }, [dishNameValue, getCalories, servingCount]);

  useEffect(() => {
    if (dishName && servings) {
      getCalories({
        dish_name: dishName ?? "",
        servings: Number(servings),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-center gap-2 my-4">
        <Autocomplete
          wrapperclassName="w-full md:w-[calc(100%-180px)]"
          options={dropdownOptions.filter((item) =>
            item.label.toLowerCase().includes(dishNameValue.toLowerCase()),
          )}
          onSelect={onSelect}
          placeholder="Search for foods and recipes"
          value={dishNameValue}
          onChange={onChangeDishName}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
        />
        <div className="flex items-center gap-2 w-full md:w-25">
          <Input
            type="number"
            placeholder="Servings"
            className="w-20"
            step="0.1"
            min={0.1}
            value={servingCount}
            onChange={onChangeServingCount}
          />
          <Button
            variant="primary"
            className="w-30"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={onSubmit}
          >
            Search
          </Button>
        </div>
      </div>
      {isLoading && <div className="mt-4">Loading...</div>}
      {error?.retryAfter && <RateLimitMessage seconds={error.retryAfter} />}
      {result && !error && !isLoading && <CalorieResultCard meal={result} />}
      {error && error.status_code === 404 && !isLoading && (
        <MealNotFound query={error?.message} />
      )}
    </>
  );
}
