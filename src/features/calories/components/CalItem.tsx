type Props = {
  value: number;
  label: string;
  color: "orange" | "green" | "dark";
  testId?: string;
};

function CalItem({ value, label, color, testId, ...props }: Props) {
  const colors = {
    orange: "text-secondary",
    green: "text-primary",
    dark: "text-foreground",
  };
  return (
    <div
      data-testid={testId}
      className="flex-1 flex flex-col items-center justify-center py-3.5 border-r border-border last:border-r-0"
      {...props}
    >
      <span
        className={`font-serif text-3xl font-bold leading-none ${colors[color]}`}
      >
        {value}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
        {label}
      </span>
    </div>
  );
}

export default CalItem;
