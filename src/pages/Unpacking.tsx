import { useState } from "react";
import { Link } from "react-router-dom";
import { Unlock, User, Clock, Image as ImageIcon, Search, Package } from "lucide-react";
import { useExhibitionStore } from "@/store/exhibitionStore";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, TextArea, Select } from "@/components/ui/Input";
import { PhotoUpload } from "@/components/business/PhotoUpload";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDateTime, classNames } from "@/utils/format";

export default function Unpacking() {
  const all = useExhibitionStore((s) => s.exhibitions);
  const addUnpackingRecord = useExhibitionStore((s) => s.addUnpackingRecord);
  const user = useAuthStore((s) => s.user);

  const available = all.filter((e) => e.status !== "completed" && e.status !== "pending_packing");
  const allRecords = all
    .flatMap((ex) =>
      ex.unpackingRecords.map((r) => ({ ...r, artifactName: ex.artifactName, exhibitionId: ex.id }))
    )
    .sort((a, b) => new Date(b.unpackedAt).getTime() - new Date(a.unpackedAt).getTime());

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    exhibitionId: "",
    operatorName: "",
    reason: "",
    photos: [] as string[],
  });
  const [err, setErr] = useState("");
  const [keyword, setKeyword] = useState("");

  const submit = () => {
    if (!form.exhibitionId) {
      setErr("请选择借展记录");
      return;
    }
    if (!form.operatorName.trim()) {
      setErr("请填写开箱人员");
      return;
    }
    if (!form.reason.trim()) {
      setErr("请填写开箱原因");
      return;
    }
    if (form.photos.length === 0) {
      setErr("请上传至少一张现场照片");
      return;
    }
    addUnpackingRecord({
      exhibitionId: form.exhibitionId,
      operatorName: form.operatorName.trim(),
      reason: form.reason.trim(),
      photos: form.photos,
    });
    setShow(false);
    setForm({ exhibitionId: "", operatorName: "", reason: "", photos: [] });
    setErr("");
  };

  const filtered = allRecords.filter((r) => {
    if (!keyword) return true;
    const k = keyword.toLowerCase();
    return (
      r.artifactName.toLowerCase().includes(k) ||
      r.operatorName.toLowerCase().includes(k) ||
      r.reason.toLowerCase().includes(k)
    );
  });

  return (
    <div className="space-y-6">
      <Card className="p-6 animate-fade-up stagger-1 bg-gradient-to-r from-vermilion-700 to-vermilion-600 text-white border-vermilion-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
              <Unlock size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold">开箱操作登记</h3>
              <p className="text-white/80 text-sm mt-1">
                任何开箱操作必须登记人员与现场照片，确保文物安全可追溯
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              setShow(true);
              setForm({
                exhibitionId: "",
                operatorName: user?.name || "",
                reason: "",
                photos: [],
              });
              setErr("");
            }}
          >
            <Unlock size={18} /> 新增开箱登记
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden animate-fade-up stagger-2">
        <div className="px-6 py-4 border-b border-parchment-200 bg-parchment-50 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-serif text-lg font-semibold text-ink-800 flex items-center gap-2">
            <Unlock size={18} className="text-vermilion-600" />
            开箱记录历史
            <span className="text-xs text-ink-400 font-normal">共 {allRecords.length} 条</span>
          </h3>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              size={14}
            />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索文物/人员/原因..."
              className="pl-9 pr-4 py-2 rounded-lg border border-parchment-300 bg-white text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-bronze-400/50 focus:border-bronze-400 transition w-64"
            />
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-400">
            <Unlock size={40} className="mx-auto mb-3 text-parchment-300" />
            <p>暂无开箱记录</p>
          </div>
        ) : (
          <div className="divide-y divide-parchment-100">
            {filtered.map((r, i) => (
              <div
                key={r.id}
                className={classNames(
                  "p-5 animate-fade-up hover:bg-parchment-50",
                  `stagger-${Math.min(i + 1, 6)}`
                )}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link
                        to={`/exhibitions/${r.exhibitionId}`}
                        className="font-medium text-ink-800 hover:text-bronze-700 transition"
                      >
                        {r.artifactName}
                      </Link>
                      <span className="inline-flex items-center gap-1 text-xs text-ink-500">
                        <User size={12} /> {r.operatorName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-ink-500">
                        <Clock size={12} /> {formatDateTime(r.unpackedAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-600 bg-parchment-50 p-3 rounded-lg border border-parchment-200">
                      <span className="text-ink-400 mr-2">开箱原因：</span>
                      {r.reason}
                    </p>
                    {r.photos.length > 0 && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {r.photos.map((p, idx) => (
                          <div
                            key={idx}
                            className="w-16 h-16 rounded-lg overflow-hidden border border-parchment-300 bg-white"
                          >
                            {p.startsWith("data:") ? (
                              <img src={p} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-ink-300">
                                <ImageIcon size={16} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={show}
        onClose={() => setShow(false)}
        title="开箱操作登记"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShow(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={submit}>
              确认登记
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-vermilion-50 border border-vermilion-200 text-vermilion-700 text-sm">
            ⚠️ 开箱记录是文物安全追溯的重要凭证，请务必如实填写人员、原因并上传现场照片。
          </div>
          <Select
            label="选择借展文物"
            required
            value={form.exhibitionId}
            onChange={(e) => setForm({ ...form, exhibitionId: e.target.value })}
          >
            <option value="">请选择...</option>
            {available.map((ex) => (
              <option key={ex.id} value={ex.id}>
                [{ex.artifactNo}] {ex.artifactName}
              </option>
            ))}
          </Select>
          {form.exhibitionId && (
            <div className="text-xs text-ink-500 -mt-2 pl-1">
              当前状态：
              <StatusBadge
                status={available.find((e) => e.id === form.exhibitionId)!.status}
              />
            </div>
          )}
          <Input
            label="开箱人员"
            required
            value={form.operatorName}
            onChange={(e) => setForm({ ...form, operatorName: e.target.value })}
            placeholder="请输入开箱操作人员姓名"
          />
          <TextArea
            label="开箱原因"
            required
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="例如：途中检查 / 到馆验收 / 展陈调整 / 包装修复..."
            rows={3}
          />
          <PhotoUpload
            label="现场照片（必填）"
            required
            photos={form.photos}
            onChange={(p) => setForm({ ...form, photos: p })}
          />
          {err && (
            <p className="text-sm text-vermilion-600 bg-vermilion-50 p-2 rounded">{err}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
