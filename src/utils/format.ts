export const formatCurrency = (val: number): string => {
  if (val >= 10000) {
    return `¥${(val / 10000).toFixed(1)}万`;
  }
  return `¥${val.toLocaleString()}`;
};

export const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
};

export const formatDate = (s: string): string => {
  if (!s) return "";
  if (s.includes("T")) {
    return formatDateTime(s).split(" ")[0];
  }
  return s;
};

export const nowIso = (): string => new Date().toISOString();

export const genId = (prefix = "id"): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const classNames = (...args: (string | false | null | undefined)[]): string =>
  args.filter(Boolean).join(" ");
