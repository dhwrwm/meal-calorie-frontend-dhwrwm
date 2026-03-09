"use client";

import Link from "next/link";
import { MealSearch } from "@/types/meal";
import { Card } from "@/components/common/card";
import dayjs from "@/lib/dayjs";

type Props = {
  item: MealSearch;
};

function RecentSearchCard({ item }: Props) {
  return (
    <Card className="my-6">
      <Link
        href={`/calories?dish_name=${item.dish_name}&servings=${item.servings}`}
        className="w-full flex items-center gap-3.5 p-4"
      >
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-extrabold text-foreground truncate leading-tight">
            {item.dish_name}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[12px] text-muted-foreground font-medium">
              {item.servings} servings · {dayjs(item.createdAt).fromNow()}
            </span>
          </div>
        </div>

        {/* Calories */}
        <div className="shrink-0 text-right">
          <p className="font-serif text-2xl font-bold text-orange-500 leading-none">
            {Math.round(item.total_calories)}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
            kcal
          </p>
        </div>
      </Link>
    </Card>
  );
}

export default RecentSearchCard;
