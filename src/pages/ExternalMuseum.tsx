import { Link } from "react-router-dom";
import {
  Building2,
  Package,
  Landmark,
  Eye,
  CalendarRange,
  Shield,
  Unlock,
  FileCheck2,
  Phone,
} from "lucide-react";
import { useExhibitionStore } from "@/store/exhibitionStore";
import { useAuthStore } from "@/store/authStore";
import { mockMuseums } from "@/data/mockData";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, formatDateTime, classNames } from "@/utils/format";

export default function ExternalMuseum() {
  const all = useExhibitionStore((s) => s.exhibitions);
  const user = useAuthStore((s) => s.user);
  const museum = mockMuseums.find((m) => m.id === user?.museumId);

  const list = all.filter((e) => e.museumId === user?.museumId);
  const active = list.filter((e) =>
    ["signed", "in_transit", "delivered", "packed"].includes(e.status)
  );
  const completed = list.filter((e) => e.status === "completed");

  return (
    <div className="space-y-6">
      <Card className="p-6 animate-fade-up stagger-1 bg-gradient-to-r from-ink-800 to-ink-700 text-parchment-100 border-ink-700">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 rounded-xl bg-bronze-400/20 border border-bronze-400/30 flex items-center justify-center text-bronze-300 shrink-0">
              <Building2 size={28} />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-2xl font-semibold text-gradient-bronze">
                {museum?.name || "外部展馆"}
              </h2>
              <div className="mt-2 flex items-center gap-4 flex-wrap text-sm text-ink-300">
                <span className="inline-flex items-center gap-1.5">
                  <Landmark size={14} /> {museum?.address}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} /> {museum?.contact}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full sm:w-auto">
            <StatMini label="借展总数" value={list.length} />
            <StatMini label="当前展期" value={active.length} />
            <StatMini label="已完成" value={completed.length} />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden animate-fade-up stagger-2">
        <div className="px-6 py-4 border-b border-parchment-200 bg-parchment-50">
          <h3 className="font-serif text-lg font-semibold text-ink-800 flex items-center gap-2">
            <Package size={18} className="text-bronze-600" />
            本馆借展文物
          </h3>
        </div>
        {list.length === 0 ? (
          <div className="text-center py-16 text-ink-400">
            <Building2 size={40} className="mx-auto mb-3 text-parchment-300" />
            <p>暂无借展记录</p>
          </div>
        ) : (
          <div className="divide-y divide-parchment-100">
            {list.map((ex, i) => (
              <div
                key={ex.id}
                className={classNames(
                  "p-5 animate-fade-up",
                  `stagger-${Math.min(i + 1, 6)}`
                )}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-ink-50 border border-ink-100 flex items-center justify-center text-ink-600 shrink-0">
                      <Package size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-ink-800">{ex.artifactName}</h4>
                        <StatusBadge status={ex.status} />
                      </div>
                      <p className="text-xs text-ink-400 mt-0.5 font-mono">{ex.artifactNo}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                        <InfoMini icon={Shield} label="保险金额" value={formatCurrency(ex.insuranceAmount)} />
                        <InfoMini icon={CalendarRange} label="展期" value={`${formatDate(ex.startDate)} ~ ${formatDate(ex.endDate)}`} />
                        <InfoMini icon={FileCheck2} label="策展人" value={ex.curatorName} />
                        <InfoMini icon={Unlock} label="开箱次数" value={`${ex.unpackingRecords.length} 次`} />
                      </div>
                      {ex.environmentLogs.length > 0 && (
                        <div className="mt-3 text-xs text-ink-500 bg-parchment-50 px-3 py-2 rounded-lg">
                          最近环境数据：
                          {formatDateTime(
                            ex.environmentLogs[ex.environmentLogs.length - 1].recordedAt
                          )}
                          {" · "}
                          温度 {ex.environmentLogs[ex.environmentLogs.length - 1].temperature.toFixed(1)}°C
                          {" · "}
                          湿度 {ex.environmentLogs[ex.environmentLogs.length - 1].humidity.toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/exhibitions/${ex.id}`}>
                      <Button size="sm">
                        <Eye size={14} /> 查看详情
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-5 animate-fade-up stagger-3 bg-bronze-50/60 border-bronze-200">
        <p className="text-sm text-ink-600">
          <span className="font-medium text-bronze-700">提示：</span>
          外部展馆仅可查看本展馆借到的文物状态及相关流程信息，无法查看其他展馆的数据。任何开箱操作请务必前往「开箱登记」页面留存人员与照片记录。
        </p>
      </Card>
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="px-5 py-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm text-center min-w-[100px]">
      <p className="text-xs text-ink-300">{label}</p>
      <p className="font-serif text-2xl font-semibold text-bronze-300 mt-1">{value}</p>
    </div>
  );
}

function InfoMini({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <div className="w-7 h-7 rounded-md bg-bronze-50 flex items-center justify-center text-bronze-600 shrink-0 mt-0.5">
        <Icon size={13} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm font-medium text-ink-800 truncate">{value}</p>
      </div>
    </div>
  );
}
