"use client";
import { ReactNode } from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import FormHelperText from "./form-helper-text";

type Props = {
  wrapperclassName?: string;
  className?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  error?: boolean;
  icon?: ReactNode;
  borderless?: boolean;
} & React.HTMLProps<HTMLInputElement>;

const Input = ({
  label = "",
  required,
  error,
  helperText,
  className,
  wrapperclassName = "",
  placeholder,
  borderless,
  icon,
  ...props
}: Props) => {
  return (
    <div className={twMerge("relative", wrapperclassName)}>
      {icon}
      <input
        {...props}
        placeholder={placeholder ?? label}
        className={twMerge(
          classNames(
            "h-11 w-full rounded-md border border-input bg-background px-4 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            {
              "border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0":
                borderless,
              "border-none bg-muted text-muted-foreground shadow-none":
                props.disabled,
            },
          ),
          className,
        )}
      />
      {helperText && (
        <div className="mt-1">
          <FormHelperText error={error}>{helperText}</FormHelperText>
        </div>
      )}
    </div>
  );
};

export default Input;
