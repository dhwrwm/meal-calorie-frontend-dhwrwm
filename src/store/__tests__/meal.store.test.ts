import { describe, it, expect, beforeEach } from "vitest";
import { useMealStore } from "../meal.store";
import { MealSearch } from "@/types/meal";

const makeMeal = (id: string, dish_name: string): MealSearch => ({
  id,
  dish_name,
  servings: 1,
  total_calories: 300,
  createdAt: new Date().toISOString(),
});

describe("useMealStore", () => {
  beforeEach(() => {
    useMealStore.setState({ searches: [] });
  });

  it("initializes with empty searches", () => {
    expect(useMealStore.getState().searches).toEqual([]);
  });

  it("addSearch prepends a new search", () => {
    useMealStore.getState().addSearch(makeMeal("1", "Pizza"));
    useMealStore.getState().addSearch(makeMeal("2", "Sushi"));

    const { searches } = useMealStore.getState();
    expect(searches[0].dish_name).toBe("Sushi");
    expect(searches[1].dish_name).toBe("Pizza");
  });

  it("addSearch keeps only the 20 most recent searches", () => {
    for (let i = 1; i <= 25; i++) {
      useMealStore.getState().addSearch(makeMeal(String(i), `Meal ${i}`));
    }

    expect(useMealStore.getState().searches).toHaveLength(20);
  });

  it("most recent search is first after cap", () => {
    for (let i = 1; i <= 25; i++) {
      useMealStore.getState().addSearch(makeMeal(String(i), `Meal ${i}`));
    }

    expect(useMealStore.getState().searches[0].dish_name).toBe("Meal 25");
  });

  it("clearSearches empties the list", () => {
    useMealStore.getState().addSearch(makeMeal("1", "Pizza"));
    useMealStore.getState().addSearch(makeMeal("2", "Sushi"));

    useMealStore.getState().clearSearches();

    expect(useMealStore.getState().searches).toEqual([]);
  });

  it("clearSearches does not throw on empty list", () => {
    expect(() => useMealStore.getState().clearSearches()).not.toThrow();
  });
});
