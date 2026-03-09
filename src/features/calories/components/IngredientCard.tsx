import { Ingredient } from "@/types/meal";

type Props = {
  ing: Ingredient;
};

function IngredientCard({ ing }: Props) {
  const im = ing.macronutrients_per_100g || {};
  const macros = [
    ["Protein", im.protein],
    ["Fat", im.total_fat],
    ["Carbs", im.carbohydrates],
    ["Sat.Fat", im.saturated_fat],
  ];
  return (
    <div className="bg-muted rounded-xl p-3.5 mb-2">
      {/* top row */}
      <div className="flex justify-between items-start gap-3 mb-3">
        <div>
          <p className="text-sm font-extrabold text-foreground">{ing.name}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {ing.serving_size && (
              <span className="text-[10px] font-bold bg-card border border-border text-muted-foreground rounded-full px-2 py-0.5">
                🥄 {ing.serving_size}
              </span>
            )}
            {ing.data_type && (
              <span className="text-[10px] font-bold bg-card border border-border text-muted-foreground rounded-full px-2 py-0.5">
                {ing.data_type}
              </span>
            )}
            {ing.brand && (
              <span className="text-[10px] font-bold bg-card border border-border text-muted-foreground rounded-full px-2 py-0.5">
                🏷️ {ing.brand}
              </span>
            )}
            {ing.fdc_id && (
              <span className="text-[10px] font-bold bg-card border border-border text-muted-foreground rounded-full px-2 py-0.5">
                FDC #{ing.fdc_id}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-secondary">
            {ing.calories_per_100g} kcal
          </p>
          <p className="text-[10px] text-muted-foreground font-medium">
            per 100g
          </p>
        </div>
      </div>
      {/* macro mini-grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {macros.map(([label, val]) => (
          <div
            key={label}
            className="bg-card rounded-lg py-1.5 px-2 text-center"
          >
            <p className="text-sm font-extrabold text-foreground">
              {val != null ? `${(+val).toFixed(1)}g` : "—"}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IngredientCard;
