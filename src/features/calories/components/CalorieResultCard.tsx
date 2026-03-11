"use client";

import { Card } from "@/components/common/card";
import { playfairDisplay } from "@/lib/fonts";
import CalItem from "./CalItem";
import MacroCell from "./MacroCell";
import { useMemo, useState } from "react";
import { formatLabel } from "@/lib/common";
import IngredientCard from "./IngredientCard";
import { Meal } from "@/types/meal";

const CalorieResultCard = ({ meal }: { meal: Meal }) => {
  const [tab, setTab] = useState<"per" | "total">("per");

  const {
    dish_name,
    total_calories,
    calories_per_serving,
    servings,
    macronutrients_per_serving: mps,
    total_macronutrients: mtot,
    ingredient_breakdown,
    matched_food,
    source,
  } = meal;
  const activeRows = useMemo(
    () => (tab === "per" ? mps : mtot) ?? [],
    [tab, mps, mtot],
  );

  return (
    <Card className="rounded-2xl shadow-2xl" data-testid="calorie-result-card">
      <div className="p-4">
        <h2
          className={`text-3xl uppercase font-bold mb-2 ${playfairDisplay.className}`}
        >
          {dish_name}
        </h2>
        <span className="text-sm font-medium py-1 px-4 bg-secondary/15 text-secondary rounded">
          🍽️ {servings} servings, {total_calories?.toFixed(2)} kcal
        </span>
      </div>
      <hr className="border-muted" />
      {/* ── Calorie strip ── */}
      <div className="flex border-b border-border">
        <CalItem
          value={Math.round(calories_per_serving)}
          testId="cal-item-cal-/-serving"
          label="Cal / Serving"
          color="orange"
        />
        <CalItem
          testId="cal-item-total-calories"
          value={Math.round(total_calories)}
          label="Total Calories"
          color="green"
        />
        <CalItem
          testId="cal-item-servings"
          value={servings}
          label="Servings"
          color="dark"
        />
      </div>

      {/* ── Primary macros ── */}
      <div className="grid grid-cols-3 border-b border-border">
        <MacroCell
          testId="macro-protein"
          value={mps.protein}
          unit="g"
          label="Protein"
          color="green"
        />
        <MacroCell
          testId="macro-carbs"
          value={mps.carbohydrates}
          unit="g"
          label="Carbs"
          color="orange"
        />
        <MacroCell
          testId="macro-fat"
          value={mps.total_fat}
          unit="g"
          label="Fat"
          color="gray"
        />
      </div>

      {/* ── Full nutrient table ── */}
      <div className="px-4 pb-3 border-b border-border">
        {/* toggle */}
        <div className="flex justify-between items-center pt-3 pb-2">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
            All Nutrients
          </p>
          <div className="flex bg-muted rounded-lg p-0.5 gap-0.5">
            {["per", "total"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as "per" | "total")}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                  tab === t
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "per" ? "Per Serving" : "Total"}
              </button>
            ))}
          </div>
        </div>
        {/* 2-column grid */}
        <div className="grid grid-cols-2">
          {Object.entries(activeRows).map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-[13px] text-muted-foreground font-medium">
                {formatLabel(label)}
              </span>
              <span className="text-[13px] font-bold text-foreground">
                {value}g
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* ── Ingredient breakdown ── */}
      {ingredient_breakdown?.length > 0 && (
        <div className="px-4 pb-2 border-b border-border">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground pt-3 pb-2">
            Ingredient Breakdown
          </p>
          {ingredient_breakdown.map((ing, i) => (
            <IngredientCard key={i} ing={ing} testId="ingredient-card" />
          ))}
        </div>
      )}

      {/* ── Matched food ── */}
      <div className="px-4 pb-4 border-t border-border pt-3">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">
          Matched Food Record
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(matched_food).map(([k, v]) => (
            <span
              key={k}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted rounded-full px-2.5 py-1"
            >
              {formatLabel(k)}:{" "}
              <strong className="text-foreground font-bold">{v}</strong>
            </span>
          ))}
        </div>
      </div>

      {/* ── Source bar ── */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted">
        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        <span className="text-[12px] font-semibold text-muted-foreground">
          Source: {source || "N/A"}
        </span>
      </div>
    </Card>
  );
};

export default CalorieResultCard;
