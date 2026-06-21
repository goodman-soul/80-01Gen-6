import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "@/utils/format";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, hover, className, ...rest }: Props) {
  return (
    <div
      className={classNames(
        "bg-white rounded-xl shadow-soft border border-parchment-300/50 overflow-hidden",
        hover && "transition-all duration-300 hover:shadow-card hover:-translate-y-1",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
