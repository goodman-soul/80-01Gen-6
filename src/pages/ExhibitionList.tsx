import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Plus, Eye } from "lucide-react";
import { useExhibitionStore } from "@/store/exhibitionStore";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { STATUS_LABEL, type ExhibitionStatus } from "@/types";
import { formatCurrency, formatDate, classNames } from "@/utils/format";

const filters: ExhibitionStatus[] = [
  "pending_packing",
  "packed",
  "in_transit",
  "delivered",
  "signed",
  "completed",
];

export default function ExhibitionList() {
  const all = useExhibitionStore((s) => s.exhibitions);
  const user = useAuthStore((s) => s.user);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExhibitionStatus | "all">("all");

  const list = useMemo(() => {
    return all.filter((e) => {
      if (user?.role === "external" && user.museumId && e.museumId !== user.museumId) {
        return false;
      }
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (keyword) {
        const k = keyword.toLowerCase();
        return (
          e.artifactName.toLowerCase().includes(k) ||
          e.artifactNo.toLowerCase().includes(k) ||
          e.museumName.toLowerCase().includes(k)
        );
      }
      return true;
    });
  }, [all, keyword, statusFilter, user]);

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                size={16}
              />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索文物名称 / 编号 / 展馆..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-parchment-300 bg-parchment-50 text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-bronze-400/50 focus:border-bronze-400 transition"
              />
            </div>
            <div className="flex items-center gap-1 text-ink-500">
              <Filter size={16} />
              <span className="text-sm">筛选：</span>
            </div>
          </div>
          {user?.role === "curator" && (
            <Link to="/exhibitions/new">
              <Button>
                <Plus size={16} /> 发起借展
              </Button>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <button
            onClick={() => setStatusFilter("all")}
            className={classNames(
              "px-3.5 py-1.5 rounded-full text-sm font-medium transition-all",
              statusFilter === "all"
                ? "bg-ink-800 text-parchment-50"
                : "bg-parchment-100 text-ink-600 hover:bg-parchment-200"
            )}
          >
            全部 ({all.length})
          </button>
          {filters.map((f) => {
            const n = all.filter((e) => e.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={classNames(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition-all",
                  statusFilter === f
                    ? "bg-ink-800 text-parchment-50"
                    : "bg-parchment-100 text-ink-600 hover:bg-parchment-200"
                )}
              >
                {STATUS_LABEL[f]} ({n})
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="bg-parchment-50 border-b border-parchment-200">
                <th className="px-5 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                  文物信息
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                  目标展馆
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                  保险金额
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                  环境要求
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                  展期
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-ink-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-100">
              {list.map((ex, i) => (
                <tr
                  key={ex.id}
                  className={classNames(
                    "hover:bg-parchment-50/70 transition-colors animate-fade-up",
                    `stagger-${Math.min((i % 6) + 1, 6)}`
                  )}
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink-800">{ex.artifactName}</p>
                    <p className="text-xs text-ink-400 mt-0.5 font-mono">{ex.artifactNo}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-700">{ex.museumName}</td>
                  <td className="px-5 py-4 text-sm font-medium text-bronze-700">
                    {formatCurrency(ex.insuranceAmount)}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-ink-600">
                      温度 {ex.tempMin}~{ex.tempMax}°C
                    </p>
                    <p className="text-xs text-ink-600">
                      湿度 {ex.humidityMin}~{ex.humidityMax}%
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-600">
                    {formatDate(ex.startDate)} ~ {formatDate(ex.endDate)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={ex.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/exhibitions/${ex.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-ink-600 hover:bg-ink-50 hover:text-bronze-700 transition"
                    >
                      <Eye size={14} /> 详情
                    </Link>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-ink-400">
                    暂无符合条件的借展记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
