import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { classNames } from "@/utils/format";

interface BaseProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function Input({
  label,
  error,
  hint,
  required,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & BaseProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ink-700">
          {label}
          {required && <span className="text-vermilion-600 ml-0.5">*</span>}
        </label>
      )}
      <input
        className={classNames(
          "w-full px-4 py-2.5 rounded-lg border bg-parchment-50 text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-bronze-400/50 focus:border-bronze-400 transition-all duration-200",
          error ? "border-vermilion-400 focus:ring-vermilion-300" : "border-parchment-400",
          className
        )}
        {...rest}
      />
      {error && <p className="text-xs text-vermilion-600">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  error,
  hint,
  required,
  className,
  rows = 4,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & BaseProps & { rows?: number }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ink-700">
          {label}
          {required && <span className="text-vermilion-600 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={classNames(
          "w-full px-4 py-2.5 rounded-lg border bg-parchment-50 text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-bronze-400/50 focus:border-bronze-400 transition-all duration-200 resize-none",
          error ? "border-vermilion-400 focus:ring-vermilion-300" : "border-parchment-400",
          className
        )}
        {...rest}
      />
      {error && <p className="text-xs text-vermilion-600">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  hint,
  required,
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & BaseProps & { children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ink-700">
          {label}
          {required && <span className="text-vermilion-600 ml-0.5">*</span>}
        </label>
      )}
      <select
        className={classNames(
          "w-full px-4 py-2.5 rounded-lg border bg-parchment-50 text-ink-800 focus:outline-none focus:ring-2 focus:ring-bronze-400/50 focus:border-bronze-400 transition-all duration-200",
          error ? "border-vermilion-400 focus:ring-vermilion-300" : "border-parchment-400",
          className
        )}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-xs text-vermilion-600">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
