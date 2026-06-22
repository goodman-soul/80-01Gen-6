import { useState } from "react";
import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  PackageCheck,
  ThermometerSun,
  Droplets,
  CalendarRange,
  Shield,
  Landmark,
  Unlock,
  User,
  Image as ImageIcon,
  Clock,
  MapPin,
  FileCheck2,
} from "lucide-react";
import { useExhibitionStore } from "@/store/exhibitionStore";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, WarningBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, TextArea } from "@/components/ui/Input";
import { PhotoUpload } from "@/components/business/PhotoUpload";
import { ProcessTimeline } from "@/components/business/ProcessTimeline";
import { EnvironmentChart } from "@/components/business/EnvironmentChart";
import { formatCurrency, formatDateTime, classNames } from "@/utils/format";

export default function ExhibitionDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const getById = useExhibitionStore((s) => s.getById);
  const addEnvironmentLog = useExhibitionStore((s) => s.addEnvironmentLog);
  const addUnpackingRecord = useExhibitionStore((s) => s.addUnpackingRecord);
  const confirmSign = useExhibitionStore((s) => s.confirmSign);
  const confirmPacking = useExhibitionStore((s) => s.confirmPacking);
  const user = useAuthStore((s) => s.user);
  const ex = getById(id);

  const [showEnv, setShowEnv] = useState(false);
  const [envForm, setEnvForm] = useState({ temperature: "20", humidity: "50", location: "" });
  const [envErr, setEnvErr] = useState("");

  const [showUnpack, setShowUnpack] = useState(false);
  const [unpackForm, setUnpackForm] = useState({ operatorName: "", reason: "", photos: [] as string[] });
  const [unpackErr, setUnpackErr] = useState("");

  const [showSign, setShowSign] = useState(false);
  const [signForm, setSignForm] = useState({
    receiverName: "",
    isGoodCondition: true,
    remark: "",
    photos: [] as string[],
  });
  const [signErr, setSignErr] = useState("");

  const [showPack, setShowPack] = useState(false);
  const [packForm, setPackForm] = useState({ packerName: "", remark: "", photos: [] as string[] });
  const [packErr, setPackErr] = useState("");

  if (!ex) {
    return (
      <div className="text-center py-20 text-ink-400">
        <p>借展记录不存在</p>
        <Link to="/exhibitions" className="text-bronze-600 hover:underline text-sm mt-2 inline-block">
          返回列表
        </Link>
      </div>
    );
  }

  if (user?.role === "external" && user.museumId && ex.museumId !== user.museumId) {
    return <Navigate to="/external" replace />;
  }

  const isEnvAbnormal = (t: number, h: number) =>
    t < ex.tempMin || t > ex.tempMax || h < ex.humidityMin || h > ex.humidityMax;

  const submitEnv = () => {
    const t = Number(envForm.temperature);
    const h = Number(envForm.humidity);
    if (!t || !h) {
      setEnvErr("请填写温度和湿度");
      return;
    }
    if (!envForm.location.trim()) {
      setEnvErr("请填写记录地点");
      return;
    }
    addEnvironmentLog({
      exhibitionId: ex.id,
      temperature: t,
      humidity: h,
      location: envForm.location.trim(),
      operatorId: user?.id || "",
    });
    setShowEnv(false);
    setEnvErr("");
  };

  const submitUnpack = () => {
    if (!unpackForm.operatorName.trim()) {
      setUnpackErr("请填写开箱人员");
      return;
    }
    if (!unpackForm.reason.trim()) {
      setUnpackErr("请填写开箱原因");
      return;
    }
    if (unpackForm.photos.length === 0) {
      setUnpackErr("请上传至少一张现场照片");
      return;
    }
    addUnpackingRecord({
      exhibitionId: ex.id,
      operatorName: unpackForm.operatorName.trim(),
      reason: unpackForm.reason.trim(),
      photos: unpackForm.photos,
    });
    setShowUnpack(false);
    setUnpackErr("");
    setUnpackForm({ operatorName: "", reason: "", photos: [] });
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
    confirmSign(ex.id, {
      receiverName: signForm.receiverName.trim(),
      isGoodCondition: signForm.isGoodCondition,
      remark: signForm.remark.trim(),
      photos: signForm.photos,
    });
    setShowSign(false);
    setSignErr("");
  };

  const submitPack = () => {
    if (!packForm.packerName.trim()) {
      setPackErr("请填写装箱人");
      return;
    }
    if (packForm.photos.length === 0) {
      setPackErr("请上传装箱照片");
      return;
    }
    confirmPacking(ex.id, {
      packerName: packForm.packerName.trim(),
      remark: packForm.remark.trim(),
      photos: packForm.photos,
    });
    setShowPack(false);
    setPackErr("");
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 transition"
        >
          <ArrowLeft size={16} /> 返回
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {ex.status === "pending_packing" && user?.role === "warehouse" && (
            <Button variant="secondary" onClick={() => setShowPack(true)}>
              <PackageCheck size={16} /> 确认装箱
            </Button>
          )}
          {(ex.status === "packed" || ex.status === "in_transit" || ex.status === "delivered") &&
            user?.role === "logistics" && (
              <Button variant="secondary" onClick={() => setShowEnv(true)}>
                <ThermometerSun size={16} /> 上报温湿度
              </Button>
            )}
          {ex.status === "delivered" &&
            (user?.role === "logistics" ||
              (user?.role === "external" && user.museumId === ex.museumId)) && (
              <Button onClick={() => setShowSign(true)}>
                <FileCheck2 size={16} /> 到馆签收
              </Button>
            )}
          {ex.status !== "completed" && ex.status !== "pending_packing" && (
            <Button variant="outline" onClick={() => setShowUnpack(true)}>
              <Unlock size={16} /> 开箱登记
            </Button>
          )}
        </div>
      </div>

      <Card className="p-6 animate-fade-up stagger-1">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-serif text-2xl font-semibold text-ink-800">{ex.artifactName}</h2>
              <StatusBadge status={ex.status} />
            </div>
            <p className="text-sm text-ink-500 mt-1">
              文物编号：<span className="font-mono">{ex.artifactNo}</span> · 策展人：{ex.curatorName}
            </p>
          </div>
          <p className="text-2xl font-serif font-semibold text-bronze-600">
            {formatCurrency(ex.insuranceAmount)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-parchment-200">
          <InfoItem icon={Landmark} label="目标展馆" value={ex.museumName} />
          <InfoItem
            icon={CalendarRange}
            label="展期"
            value={`${ex.startDate} ~ ${ex.endDate}`}
          />
          <InfoItem
            icon={ThermometerSun}
            label="温度要求"
            value={`${ex.tempMin}°C ~ ${ex.tempMax}°C`}
          />
          <InfoItem
            icon={Droplets}
            label="湿度要求"
            value={`${ex.humidityMin}% ~ ${ex.humidityMax}%`}
          />
        </div>
        {ex.remark && (
          <div className="mt-4 p-3 rounded-lg bg-parchment-50 border border-parchment-200">
            <p className="text-xs text-ink-400 mb-1">备注</p>
            <p className="text-sm text-ink-700">{ex.remark}</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="p-6 lg:col-span-2 animate-fade-up stagger-2">
          <h3 className="font-serif text-lg font-semibold text-ink-800 mb-5">流程时间线</h3>
          <ProcessTimeline exhibition={ex} />
        </Card>

        <Card className="p-6 lg:col-span-3 animate-fade-up stagger-3">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-semibold text-ink-800">温湿度监控</h3>
            <div className="flex items-center gap-2">
              {ex.environmentLogs.some((l) =>
                isEnvAbnormal(l.temperature, l.humidity)
              ) && <WarningBadge>存在异常数据</WarningBadge>}
            </div>
          </div>
          <EnvironmentChart exhibition={ex} />
          {ex.environmentLogs.length > 0 && (
            <div className="mt-5 space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {[...ex.environmentLogs]
                .sort(
                  (a, b) =>
                    new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
                )
                .slice(0, 8)
                .map((l, i) => {
                  const abnormal = isEnvAbnormal(l.temperature, l.humidity);
                  return (
                    <div
                      key={l.id}
                      className={classNames(
                        "flex items-center justify-between p-2.5 rounded-lg text-sm",
                        abnormal
                          ? "bg-vermilion-50 border border-vermilion-100"
                          : "bg-parchment-50"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-ink-400">{formatDateTime(l.recordedAt)}</span>
                        <span className="inline-flex items-center gap-1 text-ink-700">
                          <ThermometerSun size={12} className="text-vermilion-500" />
                          <span className={abnormal ? "font-medium text-vermilion-700" : ""}>
                            {l.temperature.toFixed(1)}°C
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-ink-700">
                          <Droplets size={12} className="text-blue-500" />
                          <span className={abnormal ? "font-medium text-vermilion-700" : ""}>
                            {l.humidity.toFixed(0)}%
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-ink-500 text-xs">
                          <MapPin size={11} /> {l.location}
                        </span>
                      </div>
                      {abnormal && (
                        <span className="text-xs text-vermilion-600 font-medium">异常</span>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6 animate-fade-up stagger-4">
        <div className="flex items-center gap-2 mb-5">
          <Unlock size={18} className="text-vermilion-600" />
          <h3 className="font-serif text-lg font-semibold text-ink-800">开箱记录</h3>
          <span className="text-xs text-ink-400">共 {ex.unpackingRecords.length} 次</span>
        </div>
        {ex.unpackingRecords.length === 0 ? (
          <div className="text-center py-10 text-ink-400 border border-dashed border-parchment-300 rounded-lg">
            <p>暂无开箱记录</p>
            <p className="text-xs mt-1">任何开箱操作必须登记人员与现场照片</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ex.unpackingRecords.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-xl border border-parchment-200 bg-parchment-50/50"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-800">
                      <User size={14} /> {u.operatorName}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-ink-600">
                      <Clock size={14} /> {formatDateTime(u.unpackedAt)}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-ink-600 bg-white px-3 py-2 rounded-lg border border-parchment-200">
                  <span className="text-ink-400 mr-2">开箱原因：</span>
                  {u.reason}
                </p>
                {u.photos.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {u.photos.map((p, i) => (
                      <div
                        key={i}
                        className="w-20 h-20 rounded-lg overflow-hidden border border-parchment-300 bg-white"
                      >
                        {p.startsWith("data:") ? (
                          <img src={p} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ink-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={showEnv}
        onClose={() => setShowEnv(false)}
        title="上报温湿度数据"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEnv(false)}>
              取消
            </Button>
            <Button variant="secondary" onClick={submitEnv}>
              提交数据
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="温度（°C）"
              required
              type="number"
              step="0.1"
              value={envForm.temperature}
              onChange={(e) => setEnvForm({ ...envForm, temperature: e.target.value })}
              hint={`要求：${ex.tempMin} ~ ${ex.tempMax}°C`}
            />
            <Input
              label="湿度（%）"
              required
              type="number"
              step="1"
              value={envForm.humidity}
              onChange={(e) => setEnvForm({ ...envForm, humidity: e.target.value })}
              hint={`要求：${ex.humidityMin} ~ ${ex.humidityMax}%`}
            />
          </div>
          <Input
            label="记录地点"
            required
            value={envForm.location}
            onChange={(e) => setEnvForm({ ...envForm, location: e.target.value })}
            placeholder="例如：运输途中-济南服务区"
          />
          {envErr && (
            <p className="text-sm text-vermilion-600 bg-vermilion-50 p-2 rounded">{envErr}</p>
          )}
        </div>
      </Modal>

      <Modal
        open={showUnpack}
        onClose={() => setShowUnpack(false)}
        title="开箱操作登记"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowUnpack(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={submitUnpack}>
              确认登记
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-vermilion-50 border border-vermilion-200 text-vermilion-700 text-sm">
            ⚠️ 任何开箱操作必须登记人员姓名、开箱原因，并上传现场照片以确保文物安全可追溯。
          </div>
          <Input
            label="开箱人员"
            required
            value={unpackForm.operatorName}
            onChange={(e) =>
              setUnpackForm({ ...unpackForm, operatorName: e.target.value })
            }
            placeholder="请输入开箱操作人员姓名"
          />
          <TextArea
            label="开箱原因"
            required
            value={unpackForm.reason}
            onChange={(e) => setUnpackForm({ ...unpackForm, reason: e.target.value })}
            placeholder="例如：途中环境检查 / 到馆验收 / 展陈调整..."
            rows={3}
          />
          <PhotoUpload
            label="现场照片"
            required
            photos={unpackForm.photos}
            onChange={(p) => setUnpackForm({ ...unpackForm, photos: p })}
          />
          {unpackErr && (
            <p className="text-sm text-vermilion-600 bg-vermilion-50 p-2 rounded">{unpackErr}</p>
          )}
        </div>
      </Modal>

      <Modal
        open={showSign}
        onClose={() => setShowSign(false)}
        title="到馆签收确认"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowSign(false)}>
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
                onChange={(e) =>
                  setSignForm({ ...signForm, isGoodCondition: e.target.checked })
                }
                className="mt-1"
              />
              <span className="text-sm text-ink-700">
                文物完好无损，包装与箱封完好，符合交接标准
              </span>
            </label>
            {!signForm.isGoodCondition && (
              <p className="text-xs text-vermilion-600 mt-2 pl-6">
                如发现异常，请在备注中详细说明情况
              </p>
            )}
          </div>
          <TextArea
            label="签收备注"
            value={signForm.remark}
            onChange={(e) => setSignForm({ ...signForm, remark: e.target.value })}
            placeholder="如有异常情况请详细描述..."
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

      <Modal
        open={showPack}
        onClose={() => setShowPack(false)}
        title="库房装箱确认"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowPack(false)}>
              取消
            </Button>
            <Button variant="secondary" onClick={submitPack}>
              确认装箱
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="装箱人"
            required
            value={packForm.packerName}
            onChange={(e) => setPackForm({ ...packForm, packerName: e.target.value })}
          />
          <TextArea
            label="装箱说明"
            value={packForm.remark}
            onChange={(e) => setPackForm({ ...packForm, remark: e.target.value })}
            placeholder="包装材料、防震措施、箱号等..."
          />
          <PhotoUpload
            label="装箱照片"
            required
            photos={packForm.photos}
            onChange={(p) => setPackForm({ ...packForm, photos: p })}
          />
          {packErr && (
            <p className="text-sm text-vermilion-600 bg-vermilion-50 p-2 rounded">{packErr}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-bronze-50 flex items-center justify-center text-bronze-600 shrink-0 mt-0.5">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm font-medium text-ink-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
