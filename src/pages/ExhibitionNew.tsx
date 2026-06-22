import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, Shield, ThermometerSun, Droplets, CalendarRange, Landmark, FileText } from "lucide-react";
import { useExhibitionStore } from "@/store/exhibitionStore";
import { useAuthStore } from "@/store/authStore";
import { mockMuseums } from "@/data/mockData";
import { Card } from "@/components/ui/Card";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { classNames } from "@/utils/format";

export default function ExhibitionNew() {
  const navigate = useNavigate();
  const createExhibition = useExhibitionStore((s) => s.createExhibition);
  const user = useAuthStore((s) => s.user);

  if (user?.role !== "curator") {
    return <Navigate to="/dashboard" replace />;
  }
  const [form, setForm] = useState({
    artifactNo: "",
    artifactName: "",
    insuranceAmount: "",
    tempMin: "18",
    tempMax: "22",
    humidityMin: "45",
    humidityMax: "55",
    startDate: "",
    endDate: "",
    museumId: "",
    remark: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.artifactNo.trim()) e.artifactNo = "请输入文物编号";
    if (!form.artifactName.trim()) e.artifactName = "请输入文物名称";
    if (!form.insuranceAmount || Number(form.insuranceAmount) <= 0)
      e.insuranceAmount = "请输入正确的保险金额";
    if (!form.startDate) e.startDate = "请选择展期开始日期";
    if (!form.endDate) e.endDate = "请选择展期结束日期";
    if (form.startDate && form.endDate && form.startDate > form.endDate)
      e.endDate = "结束日期不能早于开始日期";
    if (!form.museumId) e.museumId = "请选择目标展馆";
    if (Number(form.tempMin) >= Number(form.tempMax)) e.tempMax = "最高温度需大于最低温度";
    if (Number(form.humidityMin) >= Number(form.humidityMax))
      e.humidityMax = "最高湿度需大于最低湿度";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const museum = mockMuseums.find((m) => m.id === form.museumId)!;
    createExhibition({
      artifactNo: form.artifactNo.trim(),
      artifactName: form.artifactName.trim(),
      insuranceAmount: Number(form.insuranceAmount),
      tempMin: Number(form.tempMin),
      tempMax: Number(form.tempMax),
      humidityMin: Number(form.humidityMin),
      humidityMax: Number(form.humidityMax),
      startDate: form.startDate,
      endDate: form.endDate,
      museumId: museum.id,
      museumName: museum.name,
      curatorId: user?.id || "",
      curatorName: user?.name || "",
      remark: form.remark.trim(),
    });
    navigate("/exhibitions");
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 transition"
      >
        <ArrowLeft size={16} /> 返回列表
      </button>

      <form onSubmit={submit} className="space-y-5">
        <Card className="p-6 animate-fade-up stagger-1">
          <div className="flex items-center gap-2 mb-5">
            <FileText size={18} className="text-bronze-600" />
            <h3 className="font-serif text-lg font-semibold text-ink-800">文物基础信息</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="文物编号"
              required
              value={form.artifactNo}
              onChange={(e) => update("artifactNo", e.target.value)}
              placeholder="例如：BW-2024-0001"
              error={errors.artifactNo}
            />
            <Input
              label="文物名称"
              required
              value={form.artifactName}
              onChange={(e) => update("artifactName", e.target.value)}
              placeholder="例如：商代青铜饕餮纹方鼎"
              error={errors.artifactName}
            />
          </div>
        </Card>

        <Card className="p-6 animate-fade-up stagger-2">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={18} className="text-bronze-600" />
            <h3 className="font-serif text-lg font-semibold text-ink-800">保险与环境要求</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <Input
              label="保险金额（元）"
              required
              type="number"
              min="0"
              value={form.insuranceAmount}
              onChange={(e) => update("insuranceAmount", e.target.value)}
              placeholder="例如：5000000"
              error={errors.insuranceAmount}
              hint="珍贵文物建议投保全额保险"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={classNames("p-4 rounded-xl border", errors.tempMax ? "border-vermilion-300 bg-vermilion-50/30" : "border-parchment-200 bg-parchment-50/50")}>
              <div className="flex items-center gap-2 mb-3">
                <ThermometerSun size={16} className="text-vermilion-600" />
                <span className="text-sm font-medium text-ink-700">温度范围（°C）</span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={form.tempMin}
                  onChange={(e) => update("tempMin", e.target.value)}
                  label="最低"
                  error={errors.tempMin}
                />
                <span className="text-ink-400 pt-6">~</span>
                <Input
                  type="number"
                  value={form.tempMax}
                  onChange={(e) => update("tempMax", e.target.value)}
                  label="最高"
                  error={errors.tempMax}
                />
              </div>
            </div>

            <div className={classNames("p-4 rounded-xl border", errors.humidityMax ? "border-vermilion-300 bg-vermilion-50/30" : "border-parchment-200 bg-parchment-50/50")}>
              <div className="flex items-center gap-2 mb-3">
                <Droplets size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-ink-700">湿度范围（%）</span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={form.humidityMin}
                  onChange={(e) => update("humidityMin", e.target.value)}
                  label="最低"
                  error={errors.humidityMin}
                />
                <span className="text-ink-400 pt-6">~</span>
                <Input
                  type="number"
                  value={form.humidityMax}
                  onChange={(e) => update("humidityMax", e.target.value)}
                  label="最高"
                  error={errors.humidityMax}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 animate-fade-up stagger-3">
          <div className="flex items-center gap-2 mb-5">
            <CalendarRange size={18} className="text-bronze-600" />
            <h3 className="font-serif text-lg font-semibold text-ink-800">展期与展馆</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="展期开始日期"
              required
              type="date"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
              error={errors.startDate}
            />
            <Input
              label="展期结束日期"
              required
              type="date"
              value={form.endDate}
              onChange={(e) => update("endDate", e.target.value)}
              error={errors.endDate}
            />
            <Select
              label="目标展馆"
              required
              value={form.museumId}
              onChange={(e) => update("museumId", e.target.value)}
              error={errors.museumId}
            >
              <option value="">请选择展馆</option>
              {mockMuseums.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>
          {form.museumId && (
            <div className="mt-4 p-3 rounded-lg bg-ink-50 border border-ink-100 text-sm">
              <div className="flex items-center gap-1.5 text-ink-700 mb-1">
                <Landmark size={14} />
                <span className="font-medium">
                  {mockMuseums.find((m) => m.id === form.museumId)?.name}
                </span>
              </div>
              <p className="text-xs text-ink-500 pl-5">
                {mockMuseums.find((m) => m.id === form.museumId)?.address}
              </p>
              <p className="text-xs text-ink-500 pl-5">
                {mockMuseums.find((m) => m.id === form.museumId)?.contact}
              </p>
            </div>
          )}
          <div className="mt-5">
            <TextArea
              label="备注说明"
              value={form.remark}
              onChange={(e) => update("remark", e.target.value)}
              placeholder="文物特殊要求、防震说明、注意事项等..."
              rows={3}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            取消
          </Button>
          <Button type="submit" variant="secondary">
            提交借展申请
          </Button>
        </div>
      </form>
    </div>
  );
}
