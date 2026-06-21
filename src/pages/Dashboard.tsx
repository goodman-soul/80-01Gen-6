import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ScrollText,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle2,
  ThermometerSun,
  Droplets,
  ChevronRight,
  PackagePlus,
} from "lucide-react";
import { useExhibitionStore } from "@/store/exhibitionStore";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateTime, classNames } from "@/utils/format";

const stats = [
  {
    key: "total",
    label: "借展总数",
    icon: ScrollText,
    color: "text-ink-800",
    bg: "bg-ink-50",
  },
  {
    key: "pending",
    label: "待装箱",
    icon: PackagePlus,
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    key: "transit",
    label: "运输中",
    icon: Truck,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  {
    key: "signed",
    label: "展期内",
    icon: CheckCircle2,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
];

export default function Dashboard() {
  const exhibitions = useExhibitionStore((s) => s.exhibitions);
  const user = useAuthStore((s) => s.user);

  const data = {
    total: exhibitions.length,
    pending: exhibitions.filter((e) => e.status === "pending_packing").length,
    transit: exhibitions.filter((e) => e.status === "in_transit").length,
    signed: exhibitions.filter((e) => e.status === "signed").length,
  };

  const alerts = exhibitions
    .map((ex) => {
      const last = ex.environmentLogs[ex.environmentLogs.length - 1];
      if (!last) return null;
      const abnormal =
        last.temperature < ex.tempMin ||
        last.temperature > ex.tempMax ||
        last.humidity < ex.humidityMin ||
        last.humidity > ex.humidityMax;
      if (!abnormal) return null;
      return { ex, last };
    })
    .filter(Boolean) as { ex: any; last: any }[];

  const recent = [...exhibitions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.key}
              hover
              className={classNames("p-5 animate-fade-up", `stagger-${i + 1}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-500">{s.label}</p>
                  <p className="mt-2 font-serif text-3xl font-semibold text-ink-800">
                    {(data as any)[s.key]}
                  </p>
                </div>
                <div
                  className={classNames(
                    "w-11 h-11 rounded-xl flex items-center justify-center",
                    s.bg,
                    s.color
                  )}
                >
                  <Icon size={22} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6 animate-fade-up stagger-3">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-semibold text-ink-800">最近借展申请</h3>
            <Link
              to="/exhibitions"
              className="text-sm text-bronze-600 hover:text-bronze-700 inline-flex items-center gap-0.5"
            >
              查看全部 <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map((ex) => (
              <Link
                key={ex.id}
                to={`/exhibitions/${ex.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-parchment-200 hover:bg-parchment-50 hover:border-bronze-300 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-ink-50 flex items-center justify-center text-ink-600">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-800 group-hover:text-bronze-700">
                      {ex.artifactName}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      编号 {ex.artifactNo} · {ex.museumName} · {formatCurrency(ex.insuranceAmount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-400">{formatDateTime(ex.createdAt)}</span>
                  <StatusBadge status={ex.status} />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6 animate-fade-up stagger-4">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={18} className="text-vermilion-600" />
            <h3 className="font-serif text-lg font-semibold text-ink-800">环境告警</h3>
          </div>
          {alerts.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={36} />
              <p className="text-sm text-ink-500">暂无环境异常</p>
              <p className="text-xs text-ink-400 mt-1">所有在途文物温湿度正常</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((a, i) => (
                <Link
                  key={i}
                  to={`/exhibitions/${a.ex.id}`}
                  className="block p-3 rounded-lg bg-vermilion-50 border border-vermilion-200 hover:border-vermilion-400 transition"
                >
                  <p className="text-sm font-medium text-vermilion-800">
                    {a.ex.artifactName}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-xs text-vermilion-700">
                      <ThermometerSun size={12} /> {a.last.temperature.toFixed(1)}°C
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-vermilion-700">
                      <Droplets size={12} /> {a.last.humidity.toFixed(0)}%
                    </span>
                    <span className="text-xs text-ink-400">{a.last.location}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {user?.role === "curator" && (
        <Card className="p-6 animate-fade-up stagger-5 bg-gradient-to-r from-ink-800 to-ink-700 text-parchment-100 border-ink-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-bronze-400/20 flex items-center justify-center text-bronze-300 border border-bronze-400/30">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-bronze-200">
                  发起新的文物借展申请
                </h3>
                <p className="text-ink-300 text-sm mt-1">
                  录入文物编号、保险金额、环境要求与展期，开启借展流程
                </p>
              </div>
            </div>
            <Link to="/exhibitions/new">
              <Button variant="secondary" size="lg">
                <PackagePlus size={18} /> 立即发起
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
