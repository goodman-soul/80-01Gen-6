import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Landmark,
  User,
  Lock,
  Sparkles,
  Package,
  Truck,
  Building2,
  ScrollText,
} from "lucide-react";
import type { UserRole } from "@/types";
import { ROLE_LABEL } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { classNames } from "@/utils/format";

const roleCards: { role: UserRole; icon: typeof Landmark; desc: string; hint: string }[] = [
  { role: "curator", icon: ScrollText, desc: "策展人", hint: "发起借展 / 全局查看" },
  { role: "warehouse", icon: Package, desc: "库房管理员", hint: "装箱确认 / 开箱记录" },
  { role: "logistics", icon: Truck, desc: "物流人员", hint: "温湿度回传 / 签收" },
  { role: "external", icon: Building2, desc: "外部展馆", hint: "查看本馆借展状态" },
];

export default function Login() {
  const [role, setRole] = useState<UserRole>("curator");
  const [username, setUsername] = useState("curator");
  const [password, setPassword] = useState("curator123");
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const rolePasswords: Record<UserRole, string> = {
    curator: "curator123",
    warehouse: "warehouse123",
    logistics: "logistics123",
    external: "external123",
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = login(role, username.trim(), password);
    if (!res.ok) {
      setError(res.msg || "登录失败");
      return;
    }
    if (role === "external") {
      navigate("/external", { replace: true });
    } else {
      navigate(from === "/login" ? "/dashboard" : from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex bg-ink-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-60" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-bronze-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-ink-600/30 blur-3xl" />

      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-12 text-parchment-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-bronze-400 flex items-center justify-center text-ink-900 shadow-bronze-glow">
            <Landmark size={26} />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-gradient-bronze">
              博物馆文物借展物流平台
            </h1>
            <p className="text-xs text-ink-300 mt-0.5">Museum Heritage Loan Logistics System</p>
          </div>
        </div>

        <div className="max-w-md space-y-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bronze-400/10 border border-bronze-400/30 text-bronze-300 text-sm">
            <Sparkles size={14} />
            文物安全 · 全程可溯 · 开箱留痕
          </div>
          <h2 className="font-serif text-4xl font-semibold leading-snug text-parchment-50">
            守护每一件文物的
            <br />
            <span className="text-gradient-bronze">借展旅程</span>
          </h2>
          <p className="text-ink-300 leading-relaxed">
            从策展人发起借展、库房装箱、物流环境监控、到馆签收，直到展期结束，
            每一次开箱操作均需登记人员与现场照片，确保文物在借展全过程中的安全与可追溯。
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { n: "全程", t: "流程追溯" },
              { n: "实时", t: "环境监控" },
              { n: "强制", t: "开箱留痕" },
            ].map((x, i) => (
              <div
                key={x.t}
                className={classNames(
                  "p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-up",
                  `stagger-${i + 1}`
                )}
              >
                <p className="font-serif text-2xl font-semibold text-bronze-300">{x.n}</p>
                <p className="text-xs text-ink-300 mt-1">{x.t}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-400">© 2026 博物馆文物保护中心 · 内部专用系统</p>
      </div>

      <div className="relative w-full lg:w-[560px] flex items-center justify-center p-6 lg:p-12 bg-gradient-to-b from-parchment-50 to-parchment-100">
        <div className="w-full max-w-md space-y-7 animate-fade-up">
          <div className="text-center lg:hidden mb-8">
            <div className="w-14 h-14 mx-auto rounded-xl bg-ink-800 flex items-center justify-center text-bronze-300 mb-3">
              <Landmark size={28} />
            </div>
            <h1 className="font-serif text-xl font-semibold text-ink-800">文物借展物流平台</h1>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink-800">账号登录</h2>
            <p className="text-sm text-ink-500 mt-1">请选择您的角色后登录系统</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">选择角色</label>
              <div className="grid grid-cols-2 gap-2">
                {roleCards.map((rc) => {
                  const Icon = rc.icon;
                  const active = role === rc.role;
                  return (
                    <button
                      key={rc.role}
                      type="button"
                      onClick={() => {
                        setRole(rc.role);
                        setUsername(rc.role);
                        setPassword(rolePasswords[rc.role]);
                        setError("");
                      }}
                      className={classNames(
                        "p-3 rounded-xl border text-left transition-all",
                        active
                          ? "border-bronze-400 bg-bronze-50 ring-2 ring-bronze-400/30 shadow-bronze-glow"
                          : "border-parchment-300 bg-white hover:border-ink-300"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon
                          size={16}
                          className={active ? "text-bronze-600" : "text-ink-400"}
                        />
                        <span
                          className={classNames(
                            "text-sm font-medium",
                            active ? "text-ink-800" : "text-ink-600"
                          )}
                        >
                          {rc.desc}
                        </span>
                      </div>
                      <p className="text-xs text-ink-400 pl-6">{rc.hint}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-700">账号</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-parchment-400 bg-white text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-bronze-400/50 focus:border-bronze-400 transition"
                  placeholder={`请输入${ROLE_LABEL[role]}账号`}
                />
              </div>
              <p className="text-xs text-ink-400">
                演示账号：<span className="font-mono text-bronze-600">{role}</span> / <span className="font-mono text-bronze-600">{rolePasswords[role]}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-700">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-parchment-400 bg-white text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-bronze-400/50 focus:border-bronze-400 transition"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-vermilion-50 border border-vermilion-200 text-vermilion-700 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" block>
              登 录 系 统
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
