import { Card } from "@/components/common/card";

type Props = {
  query?: string;
};

export default function MealNotFound({ query }: Props) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      <div className="flex flex-col items-center px-8 pt-10 pb-6 border-border">
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl shadow-inner">
            🍽️
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-sm border-2 border-white">
            ⚠️
          </div>
        </div>

        <h3 className="font-serif text-xl font-bold text-foreground text-center leading-snug">
          {query ? (
            <>
              <span className="italic text-orange-500">{query}</span>
            </>
          ) : (
            "Dish not found"
          )}
        </h3>
      </div>
    </Card>
  );
}
