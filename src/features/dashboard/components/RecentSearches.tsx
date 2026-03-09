"use client";

import { useMealStore } from "@/store/meal.store";
import RecentSearchCard from "./RecentSearchCard";
import Link from "next/link";

export default function RecentSearches() {
  const history = useMealStore((s) => s.searches);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold">Recent Searches</h2>
        <Link
          href="/calories"
          className="bg-primary text-accent px-3 py-1 rounded-full text-sm font-medium hover:bg-primary/80"
        >
          Search New
        </Link>
      </div>
      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t searched for any meals yet.
        </p>
      ) : (
        <>
          {history.map((meal, i) => (
            <RecentSearchCard key={i} item={meal} />
          ))}
        </>
      )}
    </div>
  );
}
