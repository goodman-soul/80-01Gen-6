import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ScrollText,
  PackagePlus,
  Truck,
  Unlock,
  Building2,
  LogOut,
  Landmark,
} from "lucide-react";
import type { UserRole } from "@/types";
import { ROLE_LABEL } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { classNames } from "@/utils/format";

interface Props {
  role: UserRole;
}

const menus: Record<UserRole, { to: string; label: string; icon: typeof LayoutDashboard }[]> = {
  curator: [
    { to: "/dashboard", label: "总览仪表盘", icon: LayoutDashboard },
    { to: "/exhibitions", label: "借展管理", icon: ScrollText },
    { to: "/exhibitions/new", label: "发起借展", icon: PackagePlus },
    { to: "/unpacking", label: "开箱登记", icon: Unlock },
  ],
  warehouse: [
    { to: "/dashboard", label: "总览仪表盘", icon: LayoutDashboard },
    { to: "/warehouse", label: "库房装箱", icon: PackagePlus },
    { to: "/exhibitions", label: "借展查询", icon: ScrollText },
    { to: "/unpacking", label: "开箱登记", icon: Unlock },
  ],
  logistics: [
    { to: "/dashboard", label: "总览仪表盘", icon: LayoutDashboard },
    { to: "/logistics", label: "物流任务", icon: Truck },
    { to: "/exhibitions", label: "借展查询", icon: ScrollText },
    { to: "/unpacking", label: "开箱登记", icon: Unlock },
  ],
  external: [
    { to: "/external", label: "我的借展", icon: Building2 },
    { to: "/unpacking", label: "开箱登记", icon: Unlock },
  ],
};

export function Sidebar({ role }: Props) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const items = menus[role];

  return (
    <aside className="w-64 bg-ink-800 bg-grain text-parchment-50 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="px-6 py-5 border-b border-ink-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bronze-400 flex items-center justify-center text-ink-900">
            <Landmark size={22} />
          </div>
          <div>
            <h1 className="font-serif font-semibold text-lg text-gradient-bronze leading-tight">
              文物借展平台
            </h1>
            <p className="text-xs text-ink-300">Museum Loan Logistics</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-ink-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-ink-700 border border-bronze-400/40 flex items-center justify-center text-bronze-300 font-medium">
            {user?.name.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-bronze-300">{ROLE_LABEL[role]}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                classNames(
                  "sidebar-link",
                  isActive && "sidebar-link-active"
                )
              }
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-ink-700">
        <button
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="sidebar-link w-full text-vermilion-300 hover:text-vermilion-200 hover:bg-vermilion-900/30"
        >
          <LogOut size={18} />
          <span className="text-sm">退出登录</span>
        </button>
      </div>
    </aside>
  );
}
