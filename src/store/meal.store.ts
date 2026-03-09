import { MealSearch } from "@/types/meal";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MealStore {
  searches: MealSearch[];
  addSearch: (search: MealSearch) => void;
  clearSearches: () => void;
}

export const useMealStore = create<MealStore>()(
  persist(
    (set) => ({
      searches: [],

      addSearch: (search) => {
        set((state) => {
          const arr = [search, ...state.searches];

          return {
            searches: Array.from(
              new Map(arr.map((item) => [item.id, item])).values(),
            ).slice(0, 20),
          };
        });
      },

      clearSearches: () => set({ searches: [] }),
    }),
    {
      name: "meal-search-history",
      partialize: (state) => ({
        searches: state.searches,
      }),
    },
  ),
);
