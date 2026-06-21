import { useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { classNames } from "@/utils/format";

interface Props {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
  label?: string;
  required?: boolean;
}

export function PhotoUpload({ photos, onChange, max = 6, label, required }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (files: FileList | null) => {
    if (!files) return;
    const remaining = max - photos.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const readers = toAdd.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((urls) => onChange([...photos, ...urls]));
  };

  const remove = (idx: number) => {
    onChange(photos.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-ink-700">
          {label}
          {required && <span className="text-vermilion-600 ml-0.5">*</span>}
        </label>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {photos.map((p, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-lg overflow-hidden border border-parchment-300 bg-parchment-50 group"
          >
            <img
              src={p}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => remove(i)}
              className="absolute top-1 right-1 p-1 rounded-full bg-vermilion-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {photos.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={classNames(
              "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1.5 text-ink-400 transition-all",
              "border-parchment-400 bg-parchment-50 hover:border-bronze-400 hover:bg-bronze-50 hover:text-bronze-600"
            )}
          >
            <Upload size={20} />
            <span className="text-xs">上传照片</span>
          </button>
        )}
      </div>
      {photos.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          className="mt-2 border-2 border-dashed border-parchment-400 rounded-xl p-8 text-center cursor-pointer hover:border-bronze-400 hover:bg-bronze-50/40 transition-all"
        >
          <ImageIcon className="mx-auto text-ink-300 mb-2" size={32} />
          <p className="text-sm text-ink-500">点击或拖拽照片到此处上传</p>
          <p className="text-xs text-ink-400 mt-1">支持 JPG / PNG，最多 {max} 张</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={photos.length >= max}
        >
          <Upload size={14} /> 继续添加
        </Button>
      </div>
    </div>
  );
}
