type Props = {
  value: number;
  unit: string;
  label: string;
  color: "green" | "orange" | "gray";
  testId?: string;
};

function MacroCell({ value, unit, label, color, testId }: Props) {
  const colors = {
    green: "text-primary",
    orange: "text-secondary",
    gray: "text-foreground",
  };
  return (
    <div
      data-testid={testId}
      className="flex flex-col items-center py-3.5 border-r border-border last:border-r-0"
    >
      <span className={`text-xl font-extrabold leading-none ${colors[color]}`}>
        {value}
        <span className="text-xs font-semibold text-muted-foreground ml-0.5">
          {unit}
        </span>
      </span>
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
        {label}
      </span>
    </div>
  );
}

export default MacroCell;
