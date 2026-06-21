import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "@/utils/format";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  block?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-ink-800 text-parchment-50 hover:bg-ink-700 hover:shadow-card",
  secondary:
    "bg-bronze-400 text-ink-900 hover:bg-bronze-300 hover:shadow-bronze-glow",
  outline:
    "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50 hover:border-ink-300",
  danger:
    "bg-vermilion-700 text-white hover:bg-vermilion-600",
  ghost:
    "text-ink-600 hover:bg-ink-100",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2.5 rounded-lg",
  lg: "px-7 py-3.5 text-lg rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  block,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        variantClass[variant],
        sizeClass[size],
        block && "w-full",
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
