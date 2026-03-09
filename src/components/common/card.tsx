import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className = "", children, ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl shadow bg-card text-card-foreground overflow-hidden border border-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
