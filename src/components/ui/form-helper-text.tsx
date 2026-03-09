import React, { memo } from "react";

import cn from "classnames";
import { twMerge } from "tailwind-merge";

type Props = {
  error?: boolean;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const FormHelperText = ({ error, children, className }: Props) => {
  return (
    <div
      className={twMerge(
        cn("text-xs", {
          "text-[hsl(var(--destructive))]/80": error,
          "text-muted-foreground": !error,
        }),
        className,
      )}
    >
      {children}
    </div>
  );
};

export default memo(FormHelperText);
