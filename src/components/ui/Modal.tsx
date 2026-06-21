import type { HTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import { classNames } from "@/utils/format";

interface Props extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export function Modal({ open, onClose, title, children, footer, size = "md", className }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={classNames(
          "relative w-full bg-parchment-100 rounded-2xl shadow-card border border-parchment-300 overflow-hidden animate-fade-up",
          sizeMap[size],
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-parchment-300 bg-ink-800">
          <h3 className="font-serif text-lg font-semibold text-bronze-300">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-200 hover:bg-ink-700 hover:text-bronze-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-parchment-300 bg-parchment-50 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
