import { type FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type ColorFormat,
  formatColor,
  hexToRgb,
  hslToRgb,
  isValidHex,
  rgbToHex,
  rgbToHsl,
} from "../../utils/colorUtils";

interface IProps {
  color: string;
  label: string;
  colorAriaLabel: string;
  onColorChange: (color: string) => void;
  onError?: (key: string) => void;
  compact?: boolean;
  borderClass: string;
  shadowClass: string;
}

export const ColorCard: FC<IProps> = ({
  color,
  label,
  colorAriaLabel,
  onColorChange,
  onError,
  compact = false,
  borderClass,
  shadowClass,
}) => {
  const { t } = useTranslation();
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [alpha, setAlpha] = useState(1);
  const [copied, setCopied] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const rgb = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const handleHexChange = (raw: string) => {
    const hex = raw.startsWith("#") ? raw : "#" + raw;
    if (isValidHex(hex)) onColorChange(hex.toLowerCase());
  };

  const handleRgbChange = (channel: "r" | "g" | "b", value: string) => {
    const num = Math.max(0, Math.min(255, parseInt(value) || 0));
    const next = { ...rgb, [channel]: num };
    onColorChange(rgbToHex(next.r, next.g, next.b));
  };

  const handleHslChange = (channel: "h" | "s" | "l", value: string) => {
    const max = channel === "h" ? 360 : 100;
    const num = Math.max(0, Math.min(max, parseInt(value) || 0));
    const next = { ...hsl, [channel]: num };
    const newRgb = hslToRgb(next.h, next.s, next.l);
    onColorChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatColor(color, format, alpha));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      onError?.("copyError");
    }
  };

  const inputBase =
    "bg-white/10 border border-white/20 rounded text-white font-mono text-center focus:outline-none focus:border-white/50 transition-colors";

  return (
    <article className="flex flex-col items-center gap-2">
      <h3 className={compact ? "text-white text-base" : "text-white text-lg"}>
        {label}
      </h3>

      {/* Swatch — clica para abrir o color picker nativo */}
      <div className="relative cursor-pointer" onClick={() => colorInputRef.current?.click()}>
        <div
          className={`rounded-lg border-2 ${borderClass} ${shadowClass} flex items-center justify-center ${
            compact ? "w-[4.5rem] h-[4.5rem]" : "w-20 h-20 md:w-24 md:h-24"
          }`}
          style={{ backgroundColor: color }}
          role="img"
          aria-label={colorAriaLabel}
          title={t("editColor")}
        >
          <span className={`font-bold text-white drop-shadow-lg select-none ${compact ? "text-[10px]" : "text-sm md:text-base"}`}>
            {color}
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white/20 backdrop-blur-sm rounded-full p-1 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
        <input
          ref={colorInputRef}
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          aria-label={t("editColor")}
        />
      </div>

      {/* Seletor de formato */}
      <div className="flex border border-white/20 rounded overflow-hidden text-[11px]">
        {(["hex", "rgb", "rgba", "hsl"] as ColorFormat[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFormat(f)}
            className={`px-2 py-0.5 uppercase font-medium transition-colors ${
              format === f
                ? "bg-white/30 text-white"
                : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Inputs por formato */}
      {format === "hex" && (
        <input
          key={`hex-${color}`}
          type="text"
          defaultValue={color}
          onBlur={(e) => handleHexChange(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleHexChange((e.target as HTMLInputElement).value)
          }
          className={`${inputBase} w-[5.5rem] px-1.5 py-1 text-xs`}
          maxLength={7}
          spellCheck={false}
        />
      )}

      {(format === "rgb" || format === "rgba") && (
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex gap-1">
            {(["r", "g", "b"] as const).map((ch) => (
              <div key={ch} className="flex flex-col items-center gap-0.5">
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleRgbChange(ch, e.target.value)}
                  className={`${inputBase} w-10 px-0.5 py-1 text-[11px]`}
                />
                <span className="text-white/50 text-[10px] uppercase">{ch}</span>
              </div>
            ))}
          </div>
          {format === "rgba" && (
            <div className="flex flex-col items-center gap-0.5 w-full">
              <div className="flex items-center gap-2 justify-center">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="w-20 accent-white/80"
                />
                <span className="text-white font-mono text-[11px] w-8 text-center">
                  {alpha.toFixed(2)}
                </span>
              </div>
              <span className="text-white/50 text-[10px]">{t("alpha")}</span>
            </div>
          )}
        </div>
      )}

      {format === "hsl" && (
        <div className="flex gap-1">
          {(["h", "s", "l"] as const).map((ch) => (
            <div key={ch} className="flex flex-col items-center gap-0.5">
              <input
                type="number"
                min={0}
                max={ch === "h" ? 360 : 100}
                value={hsl[ch]}
                onChange={(e) => handleHslChange(ch, e.target.value)}
                className={`${inputBase} w-10 px-0.5 py-1 text-[11px]`}
              />
              <span className="text-white/50 text-[10px]">
                {ch.toUpperCase()}{ch === "h" ? "°" : "%"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Preview do valor que será copiado */}
      <div className="text-white/40 text-[10px] font-mono truncate max-w-[9rem] text-center">
        {formatColor(color, format, alpha)}
      </div>

      {/* Botão copiar */}
      <button
        type="button"
        onClick={handleCopy}
        className={`rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors ${
          compact ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"
        }`}
      >
        {copied ? t("copied") : t("copy")}
      </button>
    </article>
  );
};
