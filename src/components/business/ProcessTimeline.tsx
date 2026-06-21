import {
  FileText,
  Package,
  Truck,
  MapPinCheck,
  CheckCircle2,
  Box,
  Circle,
} from "lucide-react";
import type { Exhibition } from "@/types";
import { formatDateTime } from "@/utils/format";
import { classNames } from "@/utils/format";

interface Step {
  key: string;
  title: string;
  description?: string;
  time?: string;
  operator?: string;
  done: boolean;
  active: boolean;
  icon: typeof FileText;
}

export function ProcessTimeline({ exhibition }: { exhibition: Exhibition }) {
  const steps: Step[] = [
    {
      key: "create",
      title: "借展申请已发起",
      description: exhibition.remark || "策展人已提交借展申请",
      time: exhibition.createdAt,
      operator: exhibition.curatorName,
      done: true,
      active: exhibition.status === "pending_packing",
      icon: FileText,
    },
    {
      key: "pack",
      title: "库房装箱确认",
      description: exhibition.packingRecord?.remark,
      time: exhibition.packingRecord?.packedAt,
      operator: exhibition.packingRecord?.packerName,
      done: !!exhibition.packingRecord,
      active: exhibition.status === "packed",
      icon: Package,
    },
    {
      key: "transit",
      title: "运输中 (温湿度监控)",
      description:
        exhibition.environmentLogs.length > 0
          ? `已回传 ${exhibition.environmentLogs.length} 条环境数据`
          : undefined,
      time:
        exhibition.environmentLogs.length > 0
          ? exhibition.environmentLogs[exhibition.environmentLogs.length - 1].recordedAt
          : undefined,
      operator: exhibition.environmentLogs.length > 0 ? "物流人员" : undefined,
      done:
        exhibition.status === "in_transit" ||
        exhibition.status === "delivered" ||
        exhibition.status === "signed" ||
        exhibition.status === "completed",
      active: exhibition.status === "in_transit",
      icon: Truck,
    },
    {
      key: "deliver",
      title: "到达展馆待签收",
      done:
        exhibition.status === "delivered" ||
        exhibition.status === "signed" ||
        exhibition.status === "completed",
      active: exhibition.status === "delivered",
      icon: MapPinCheck,
    },
    {
      key: "sign",
      title: "到馆签收确认",
      description: exhibition.signRecord?.remark,
      time: exhibition.signRecord?.signedAt,
      operator: exhibition.signRecord?.receiverName,
      done: exhibition.status === "signed" || exhibition.status === "completed",
      active: false,
      icon: CheckCircle2,
    },
    {
      key: "exhibit",
      title: "展期展示中",
      done: exhibition.status === "completed",
      active: exhibition.status === "signed",
      icon: Box,
    },
  ];

  return (
    <div className="relative">
      <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-parchment-300" />
      <div className="space-y-5">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.key}
              className={classNames(
                "relative flex gap-4 animate-fade-up",
                `stagger-${Math.min(i + 1, 6)}`
              )}
            >
              <div
                className={classNames(
                  "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  s.done
                    ? "bg-ink-800 border-ink-800 text-bronze-300"
                    : s.active
                    ? "bg-bronze-400 border-bronze-400 text-ink-900 animate-pulse-soft"
                    : "bg-white border-parchment-300 text-ink-300"
                )}
              >
                {s.done ? (
                  s.active ? (
                    <Icon size={18} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )
                ) : s.active ? (
                  <Icon size={18} />
                ) : (
                  <Circle size={18} />
                )}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className={classNames(
                      "font-medium",
                      s.done || s.active ? "text-ink-800" : "text-ink-400"
                    )}
                  >
                    {s.title}
                  </h4>
                  {s.time && (
                    <span className="text-xs text-ink-400">
                      {formatDateTime(s.time)}
                    </span>
                  )}
                  {s.operator && (
                    <span className="text-xs text-bronze-600 bg-bronze-50 px-2 py-0.5 rounded-full">
                      {s.operator}
                    </span>
                  )}
                </div>
                {s.description && (
                  <p className="text-sm text-ink-500 mt-1">{s.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
