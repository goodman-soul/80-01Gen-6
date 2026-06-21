import { Bell, Search } from "lucide-react";
import { ROLE_LABEL } from "@/types";
import { useAuthStore } from "@/store/authStore";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const user = useAuthStore((s) => s.user);
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-parchment-300 sticky top-0 z-20">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-ink-800">{title}</h2>
          {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
            <input
              type="text"
              placeholder="搜索文物编号 / 名称..."
              className="w-64 pl-9 pr-4 py-2 rounded-lg border border-parchment-300 bg-parchment-50 text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-bronze-400/50 focus:border-bronze-400 transition"
            />
          </div>
          <button className="relative p-2 rounded-lg text-ink-500 hover:bg-parchment-200 transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-vermilion-500" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-parchment-300">
            <div className="text-right">
              <p className="text-sm font-medium text-ink-800">{user?.name}</p>
              <p className="text-xs text-bronze-600">
                {user?.role && ROLE_LABEL[user.role]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
