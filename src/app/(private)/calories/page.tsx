import SearchForm from "@/features/calories/components/SearchForm";

import { dmSans, playfairDisplay } from "@/lib/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calories | NutriLog",
  description:
    "NutriLog is a calorie tracker that helps you track your daily calorie intake and meal calories.",
};

export default function CaloriesPage() {
  return (
    <div className="min-h-screen py-4 md:py-10 px-4 md:px-6 max-w-4xl mx-auto">
      <h1 className={`text-3xl font-bold mb-4 ${playfairDisplay.className}`}>
        Know what feeds you
      </h1>
      <p
        className={`fade-up-4 ${dmSans.className} text-base font-light max-w-xs`}
        style={{ color: "hsl(30 18% 48%)", lineHeight: 1.7 }}
      >
        Look up calories and nutrition facts for any food.
      </p>
      <SearchForm />
    </div>
  );
}
