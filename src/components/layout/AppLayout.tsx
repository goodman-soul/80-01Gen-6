import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types";

const titles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "总览仪表盘", subtitle: "监控全部借展流程与环境状态" },
  "/exhibitions": { title: "借展管理", subtitle: "查询与管理所有文物借展记录" },
  "/exhibitions/new": { title: "发起借展申请", subtitle: "录入文物信息与借展要求" },
  "/warehouse": { title: "库房装箱管理", subtitle: "确认装箱并上传装箱凭证" },
  "/logistics": { title: "物流运输任务", subtitle: "回传温湿度与到馆签收" },
  "/unpacking": { title: "开箱操作登记", subtitle: "任何开箱必须留下人员与照片记录" },
  "/external": { title: "借展文物状态", subtitle: "查看本展馆借到的文物" },
};

const roleAllowedRoutes: Record<UserRole, string[]> = {
  curator: ["/dashboard", "/exhibitions", "/exhibitions/new", "/unpacking"],
  warehouse: ["/dashboard", "/warehouse", "/exhibitions", "/unpacking"],
  logistics: ["/dashboard", "/logistics", "/exhibitions", "/unpacking"],
  external: ["/external", "/unpacking"],
};

const roleDefaultRoute: Record<UserRole, string> = {
  curator: "/dashboard",
  warehouse: "/dashboard",
  logistics: "/dashboard",
  external: "/external",
};

function checkRoutePermission(path: string, role: UserRole): boolean {
  const allowed = roleAllowedRoutes[role];
  if (allowed.includes(path)) return true;
  if (path.startsWith("/exhibitions/") && path !== "/exhibitions/new") {
    return true;
  }
  return false;
}

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const canAccess = checkRoutePermission(location.pathname, user.role);
  if (!canAccess) {
    return <Navigate to={roleDefaultRoute[user.role]} replace />;
  }

  const meta = titles[location.pathname] || { title: "文物借展平台" };

  return (
    <div className="flex min-h-screen bg-parchment-100">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
