import type { ExhibitionStatus, UserRole } from "@/types";
import { STATUS_LABEL, STATUS_COLOR, ROLE_LABEL } from "@/types";
import { classNames } from "@/utils/format";

export function StatusBadge({ status }: { status: ExhibitionStatus }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        STATUS_COLOR[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, string> = {
    curator: "bg-ink-100 text-ink-800",
    warehouse: "bg-emerald-100 text-emerald-800",
    logistics: "bg-amber-100 text-amber-800",
    external: "bg-purple-100 text-purple-800",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        map[role]
      )}
    >
      {ROLE_LABEL[role]}
    </span>
  );
}

export function WarningBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-vermilion-100 text-vermilion-700 animate-pulse-soft">
      {children}
    </span>
  );
}
