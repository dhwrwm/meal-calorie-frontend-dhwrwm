"use client";

import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

type Props = {
  title?: string;
  onClick?: () => void;
  isSubmit?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "disabled"
    | "ghost"
    | "link"
    | "icon";
  size?: "small" | "medium" | "large" | "icon";
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: [
          "bg-[hsl(var(--primary))]",
          "text-[hsl(var(--primary-foreground))]",
          "border border-transparent",
          "hover:bg-[hsl(var(--primary))]/80",
          "hover:border-transparent",
        ],
        secondary: [
          "bg-[hsl(var(--secondary))]",
          "text-[hsl(var(--secondary-foreground))]",
          "border border-[hsl(var(--secondary))]",
          "hover:bg-[hsl(var(--secondary))]/80",
        ],
        disabled: [
          "bg-[hsl(var(--muted))]",
          "text-[hsl(var(--muted-foreground))]",
          "border border-[hsl(var(--muted))]",
          "cursor-not-allowed",
        ],
        outline: [
          "bg-transparent",
          "text-[hsl(var(--primary))]",
          "border border-[hsl(var(--primary))]",
          "hover:bg-[hsl(var(--primary))]/10",
          "hover:text-[hsl(var(--primary))]",
        ],
        ghost: [
          "bg-transparent",
          "border border-transparent",
          "text-foreground",
          "hover:bg-[hsl(var(--accent))]",
          "hover:text-[hsl(var(--accent-foreground))]",
        ],
        link: [
          "bg-transparent",
          "border border-transparent",
          "text-[hsl(var(--primary))]",
          "underline-offset-4",
          "hover:underline",
        ],
        icon: ["bg-transparent border-none text-foreground"],
      },
      size: {
        small: ["text-sm", "py-1.5", "px-3", "h-9"],
        medium: ["text-sm", "py-2", "px-4", "h-10"],
        large: ["text-base", "py-2.5", "px-6", "h-11"],
        icon: ["h-9", "w-9"],
      },
    },
    compoundVariants: [{ variant: "primary", size: "large", class: "" }],
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
);

const Button = ({
  title,
  onClick,
  isSubmit,
  variant,
  className = "",
  size,
  icon,
  children,
  isLoading,
  ...rest
}: Props) => (
  <button
    {...rest}
    type={isSubmit ? "submit" : "button"}
    className={twMerge(buttonVariants({ variant, size }), className)}
    onClick={onClick}
  >
    {icon && <span className={title && "mr-2"}>{icon}</span>}
    {isLoading && (
      <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
    )}
    {children ?? title}
  </button>
);

export default Button;
