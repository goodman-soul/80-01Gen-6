import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PackagePlus, Eye, Package } from "lucide-react";
import { useExhibitionStore } from "@/store/exhibitionStore";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, TextArea } from "@/components/ui/Input";
import { PhotoUpload } from "@/components/business/PhotoUpload";
import { formatCurrency, formatDateTime, classNames } from "@/utils/format";

export default function Warehouse() {
  const exhibitions = useExhibitionStore((s) => s.exhibitions);
  const confirmPacking = useExhibitionStore((s) => s.confirmPacking);
  const user = useAuthStore((s) => s.user);

  if (user?.role !== "warehouse" && user?.role !== "curator") {
    return <Navigate to="/dashboard" replace />;
  }

  const pending = exhibitions.filter((e) => e.status === "pending_packing");
  const packed = exhibitions.filter((e) => e.status !== "pending_packing" && e.packingRecord);

  const [active, setActive] = useState<any>(null);
  const [form, setForm] = useState({ packerName: "", remark: "", photos: [] as string[] });
  const [err, setErr] = useState("");

  const submit = () => {
    if (!form.packerName.trim()) {
      setErr("请填写装箱人姓名");
      return;
    }
    if (form.photos.length === 0) {
      setErr("请上传至少一张装箱照片");
      return;
    }
    confirmPacking(active.id, {
      packerName: form.packerName.trim(),
      remark: form.remark.trim(),
      photos: form.photos,
    });
    setActive(null);
    setForm({ packerName: "", remark: "", photos: [] });
    setErr("");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 animate-fade-up stagger-1 bg-gradient-to-r from-ink-800 to-ink-700 text-parchment-100 border-ink-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-bronze-400/20 border border-bronze-400/30 flex items-center justify-center text-bronze-300">
              <Package size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-bronze-200">
                待装箱任务：{pending.length}
              </h3>
              <p className="text-ink-300 text-sm mt-1">
                请核对文物信息后完成装箱确认，上传装箱照片以留痕
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden animate-fade-up stagger-2">
        <div className="px-6 py-4 border-b border-parchment-200 bg-parchment-50">
          <h3 className="font-serif text-lg font-semibold text-ink-800 flex items-center gap-2">
            <PackagePlus size={18} className="text-amber-600" />
            待装箱列表
          </h3>
        </div>
        {pending.length === 0 ? (
          <div className="text-center py-16 text-ink-400">
            <PackagePlus size={40} className="mx-auto mb-3 text-parchment-300" />
            <p>暂无待装箱任务</p>
          </div>
        ) : (
          <div className="divide-y divide-parchment-100">
            {pending.map((ex, i) => (
              <div
                key={ex.id}
                className={classNames(
                  "p-5 flex items-center justify-between gap-4 flex-wrap hover:bg-parchment-50 animate-fade-up",
                  `stagger-${Math.min(i + 1, 6)}`
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <PackagePlus size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-ink-800">{ex.artifactName}</p>
                    <p className="text-xs text-ink-400 mt-0.5 font-mono">{ex.artifactNo}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-ink-500 flex-wrap">
                      <span>目的地：{ex.museumName}</span>
                      <span>保险：{formatCurrency(ex.insuranceAmount)}</span>
                      <span>
                        温湿度：{ex.tempMin}~{ex.tempMax}°C / {ex.humidityMin}~{ex.humidityMax}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/exhibitions/${ex.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye size={14} /> 详情
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setActive(ex);
                      setForm({ packerName: "", remark: "", photos: [] });
                      setErr("");
                    }}
                  >
                    <PackagePlus size={14} /> 装箱确认
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {packed.length > 0 && (
        <Card className="overflow-hidden animate-fade-up stagger-3">
          <div className="px-6 py-4 border-b border-parchment-200 bg-parchment-50">
            <h3 className="font-serif text-lg font-semibold text-ink-800 flex items-center gap-2">
              <Package size={18} className="text-emerald-600" />
              已装箱记录
            </h3>
          </div>
          <div className="divide-y divide-parchment-100">
            {packed.slice(0, 8).map((ex) => (
              <div
                key={ex.id}
                className="p-5 flex items-center justify-between gap-4 flex-wrap hover:bg-parchment-50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-ink-800">{ex.artifactName}</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      装箱人：{ex.packingRecord?.packerName} ·{" "}
                      {formatDateTime(ex.packingRecord?.packedAt || "")}
                    </p>
                  </div>
                </div>
                <Link to={`/exhibitions/${ex.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye size={14} /> 查看
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title="装箱确认"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setActive(null)}>
              取消
            </Button>
            <Button variant="secondary" onClick={submit}>
              确认装箱
            </Button>
          </>
        }
      >
        {active && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-parchment-50 border border-parchment-200">
              <p className="font-medium text-ink-800">{active.artifactName}</p>
              <p className="text-xs text-ink-400 mt-0.5 font-mono">{active.artifactNo}</p>
            </div>
            <Input
              label="装箱人姓名"
              required
              value={form.packerName}
              onChange={(e) => setForm({ ...form, packerName: e.target.value })}
              placeholder="请输入装箱操作人员姓名"
            />
            <TextArea
              label="装箱说明"
              value={form.remark}
              onChange={(e) => setForm({ ...form, remark: e.target.value })}
              placeholder="包装材料、防震措施、箱号标识..."
              rows={3}
            />
            <PhotoUpload
              label="装箱照片"
              required
              photos={form.photos}
              onChange={(p) => setForm({ ...form, photos: p })}
            />
            {err && (
              <p className="text-sm text-vermilion-600 bg-vermilion-50 p-2 rounded">{err}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
