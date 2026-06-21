import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  ThermometerSun,
  Droplets,
  Eye,
  FileCheck2,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useExhibitionStore } from "@/store/exhibitionStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, TextArea } from "@/components/ui/Input";
import { PhotoUpload } from "@/components/business/PhotoUpload";
import { StatusBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime, classNames } from "@/utils/format";

export default function Logistics() {
  const all = useExhibitionStore((s) => s.exhibitions);
  const addEnvironmentLog = useExhibitionStore((s) => s.addEnvironmentLog);
  const confirmSign = useExhibitionStore((s) => s.confirmSign);

  const inTransit = all.filter((e) => e.status === "packed" || e.status === "in_transit");
  const toSign = all.filter((e) => e.status === "delivered");
  const done = all.filter((e) => e.status === "signed" || e.status === "completed");

  const [tab, setTab] = useState<"transit" | "sign" | "done">("transit");
  const [showEnv, setShowEnv] = useState<any>(null);
  const [envForm, setEnvForm] = useState({ temperature: "20", humidity: "50", location: "" });
  const [envErr, setEnvErr] = useState("");

  const [showSign, setShowSign] = useState<any>(null);
  const [signForm, setSignForm] = useState({
    receiverName: "",
    isGoodCondition: true,
    remark: "",
    photos: [] as string[],
  });
  const [signErr, setSignErr] = useState("");

  const submitEnv = () => {
    if (!envForm.temperature || !envForm.humidity) {
      setEnvErr("请填写温度和湿度");
      return;
    }
    if (!envForm.location.trim()) {
      setEnvErr("请填写记录地点");
      return;
    }
    addEnvironmentLog({
      exhibitionId: showEnv.id,
      temperature: Number(envForm.temperature),
      humidity: Number(envForm.humidity),
      location: envForm.location.trim(),
      operatorId: "",
    });
    setShowEnv(null);
    setEnvErr("");
  };

  const submitSign = () => {
    if (!signForm.receiverName.trim()) {
      setSignErr("请填写签收人");
      return;
    }
    if (signForm.photos.length === 0) {
      setSignErr("请上传签收照片");
      return;
    }
    confirmSign(showSign.id, {
      receiverName: signForm.receiverName.trim(),
      isGoodCondition: signForm.isGoodCondition,
      remark: signForm.remark.trim(),
      photos: signForm.photos,
    });
    setShowSign(null);
    setSignErr("");
  };

  const list = tab === "transit" ? inTransit : tab === "sign" ? toSign : done;

  const isAbnormal = (ex: any) => {
    const last = ex.environmentLogs[ex.environmentLogs.length - 1];
    if (!last) return false;
    return (
      last.temperature < ex.tempMin ||
      last.temperature > ex.tempMax ||
      last.humidity < ex.humidityMin ||
      last.humidity > ex.humidityMax
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          {[
            { k: "transit", l: "运输中", c: inTransit.length },
            { k: "sign", l: "待签收", c: toSign.length },
            { k: "done", l: "已完成", c: done.length },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as any)}
              className={classNames(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                tab === t.k
                  ? "bg-ink-800 text-parchment-50 shadow"
                  : "bg-parchment-100 text-ink-600 hover:bg-parchment-200"
              )}
            >
              {t.l} <span className="ml-1 opacity-70">({t.c})</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden animate-fade-up stagger-1">
        {list.length === 0 ? (
          <div className="text-center py-16 text-ink-400">
            <Truck size={40} className="mx-auto mb-3 text-parchment-300" />
            <p>暂无{tab === "transit" ? "运输中" : tab === "sign" ? "待签收" : "已完成"}任务</p>
          </div>
        ) : (
          <div className="divide-y divide-parchment-100">
            {list.map((ex, i) => {
              const last = ex.environmentLogs[ex.environmentLogs.length - 1];
              const ab = isAbnormal(ex);
              return (
                <div
                  key={ex.id}
                  className={classNames(
                    "p-5 flex items-center justify-between gap-4 flex-wrap hover:bg-parchment-50 animate-fade-up",
                    `stagger-${Math.min(i + 1, 6)}`
                  )}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={classNames(
                        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                        ab
                          ? "bg-vermilion-50 border border-vermilion-200 text-vermilion-600"
                          : "bg-indigo-50 border border-indigo-200 text-indigo-600"
                      )}
                    >
                      {ab ? <AlertTriangle size={20} /> : <Truck size={20} />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-ink-800">{ex.artifactName}</p>
                        <StatusBadge status={ex.status} />
                        {ab && (
                          <span className="tag bg-vermilion-100 text-vermilion-700 animate-pulse-soft">
                            <AlertTriangle size={12} /> 环境异常
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-400 mt-0.5 font-mono">{ex.artifactNo}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-ink-500 flex-wrap">
                        <span>
                          <MapPin size={11} className="inline mr-1" />
                          {ex.museumName}
                        </span>
                        <span>保险 {formatCurrency(ex.insuranceAmount)}</span>
                        {last && (
                          <span className="inline-flex items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                              <ThermometerSun size={11} className="text-vermilion-500" />
                              <span className={ab ? "font-medium text-vermilion-700" : ""}>
                                {last.temperature.toFixed(1)}°C
                              </span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Droplets size={11} className="text-blue-500" />
                              <span className={ab ? "font-medium text-vermilion-700" : ""}>
                                {last.humidity.toFixed(0)}%
                              </span>
                            </span>
                            <span className="text-ink-400">{formatDateTime(last.recordedAt)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link to={`/exhibitions/${ex.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye size={14} /> 详情
                      </Button>
                    </Link>
                    {(tab === "transit" || ex.status === "packed") && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setShowEnv(ex);
                          setEnvForm({ temperature: "20", humidity: "50", location: "" });
                          setEnvErr("");
                        }}
                      >
                        <ThermometerSun size={14} /> 上报温湿度
                      </Button>
                    )}
                    {(tab === "sign" || ex.status === "delivered") && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setShowSign(ex);
                          setSignForm({
                            receiverName: "",
                            isGoodCondition: true,
                            remark: "",
                            photos: [],
                          });
                          setSignErr("");
                        }}
                      >
                        <FileCheck2 size={14} /> 签收
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal
        open={!!showEnv}
        onClose={() => setShowEnv(null)}
        title="上报温湿度数据"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEnv(null)}>
              取消
            </Button>
            <Button variant="secondary" onClick={submitEnv}>
              提交
            </Button>
          </>
        }
      >
        {showEnv && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-parchment-50 border border-parchment-200 text-sm">
              <span className="text-ink-600">{showEnv.artifactName}</span>
              <span className="text-xs text-ink-400 ml-2">
                要求：{showEnv.tempMin}~{showEnv.tempMax}°C / {showEnv.humidityMin}~
                {showEnv.humidityMax}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="温度（°C）"
                required
                type="number"
                step="0.1"
                value={envForm.temperature}
                onChange={(e) => setEnvForm({ ...envForm, temperature: e.target.value })}
              />
              <Input
                label="湿度（%）"
                required
                type="number"
                step="1"
                value={envForm.humidity}
                onChange={(e) => setEnvForm({ ...envForm, humidity: e.target.value })}
              />
            </div>
            <Input
              label="记录地点"
              required
              value={envForm.location}
              onChange={(e) => setEnvForm({ ...envForm, location: e.target.value })}
              placeholder="例如：运输途中-XX高速服务区"
            />
            {envErr && (
              <p className="text-sm text-vermilion-600 bg-vermilion-50 p-2 rounded">{envErr}</p>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={!!showSign}
        onClose={() => setShowSign(null)}
        title="到馆签收确认"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowSign(null)}>
              取消
            </Button>
            <Button onClick={submitSign}>确认签收</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="签收人姓名"
            required
            value={signForm.receiverName}
            onChange={(e) => setSignForm({ ...signForm, receiverName: e.target.value })}
          />
          <div className="p-4 rounded-lg border border-parchment-300">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={signForm.isGoodCondition}
                onChange={(e) => setSignForm({ ...signForm, isGoodCondition: e.target.checked })}
                className="mt-1"
              />
              <span className="text-sm text-ink-700">
                文物完好无损，包装与箱封完好，符合交接标准
              </span>
            </label>
          </div>
          <TextArea
            label="签收备注"
            value={signForm.remark}
            onChange={(e) => setSignForm({ ...signForm, remark: e.target.value })}
            rows={2}
          />
          <PhotoUpload
            label="签收凭证照片"
            required
            photos={signForm.photos}
            onChange={(p) => setSignForm({ ...signForm, photos: p })}
          />
          {signErr && (
            <p className="text-sm text-vermilion-600 bg-vermilion-50 p-2 rounded">{signErr}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
