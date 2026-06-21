import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { EnvironmentLog, Exhibition } from "@/types";
import { formatDateTime } from "@/utils/format";

interface Props {
  exhibition: Exhibition;
  height?: number;
}

export function EnvironmentChart({ exhibition, height = 280 }: Props) {
  const data = [...exhibition.environmentLogs]
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
    .map((l: EnvironmentLog) => ({
      time: formatDateTime(l.recordedAt).slice(5),
      温度: Number(l.temperature.toFixed(1)),
      湿度: Number(l.humidity.toFixed(1)),
      告警:
        l.temperature < exhibition.tempMin ||
        l.temperature > exhibition.tempMax ||
        l.humidity < exhibition.humidityMin ||
        l.humidity > exhibition.humidityMax,
    }));

  if (data.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-ink-400 bg-parchment-50 rounded-lg border border-dashed border-parchment-300">
        暂无温湿度数据
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-3 text-xs">
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-ink-600 inline-block" />
          温度范围：{exhibition.tempMin}°C ~ {exhibition.tempMax}°C
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-bronze-500 inline-block" />
          湿度范围：{exhibition.humidityMin}% ~ {exhibition.humidityMax}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9e1d1" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#5d8d89" }} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#2d5956" }} label={{ value: "°C", position: "insideTopLeft", fontSize: 11, fill: "#2d5956" }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#a3753f" }} label={{ value: "%", position: "insideTopRight", fontSize: 11, fill: "#a3753f" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#faf8f5",
              border: "1px solid #d9cbb0",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine yAxisId="left" y={exhibition.tempMin} stroke="#8eb4b1" strokeDasharray="3 3" />
          <ReferenceLine yAxisId="left" y={exhibition.tempMax} stroke="#8eb4b1" strokeDasharray="3 3" />
          <ReferenceLine yAxisId="right" y={exhibition.humidityMin} stroke="#d9bc75" strokeDasharray="3 3" />
          <ReferenceLine yAxisId="right" y={exhibition.humidityMax} stroke="#d9bc75" strokeDasharray="3 3" />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="温度"
            stroke="#0f3b3a"
            strokeWidth={2}
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={payload.告警 ? 5 : 3}
                  fill={payload.告警 ? "#b91c1c" : "#0f3b3a"}
                  stroke="#fff"
                  strokeWidth={1}
                />
              );
            }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="湿度"
            stroke="#c9a962"
            strokeWidth={2}
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={payload.告警 ? 5 : 3}
                  fill={payload.告警 ? "#b91c1c" : "#c9a962"}
                  stroke="#fff"
                  strokeWidth={1}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
