import { z } from "zod";

export const searchSchema = z.object({
  dish_name: z.string().min(1, { message: "Dish name is required" }),
  servings: z.string().min(0.1, { message: "Servings must be greater than 0" }),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
