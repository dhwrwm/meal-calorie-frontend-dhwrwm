export type Meal = {
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  macronutrients_per_serving: {
    protein: number;
    total_fat: number;
    carbohydrates: number;
    saturated_fat: number;
  };
  total_macronutrients: {
    protein: number;
    total_fat: number;
    carbohydrates: number;
    saturated_fat: number;
  };
  source: string;
  ingredient_breakdown: Ingredient[];
  matched_food: {
    name: string;
    fdc_id: number;
    data_type: string;
    published_date: string;
  };
};

export type Ingredient = {
  name: string;
  calories_per_100g: number;
  macronutrients_per_100g: {
    protein: number;
    total_fat: number;
    carbohydrates: number;
    saturated_fat: number;
  };
  serving_size: string;
  data_type: string;
  fdc_id: number;
  brand: string;
};

export type MealSearch = {
  id: string;
  dish_name: string;
  total_calories: number;
  servings: number;
  createdAt: string;
};
