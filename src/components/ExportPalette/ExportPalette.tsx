import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ExportFormat, generateExport } from "../../utils/colorUtils";

interface IProps {
  colors: string[];
}

export const ExportPalette: FC<IProps> = ({ colors }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);

  if (colors.length === 0) return null;

  const exported = generateExport(colors, format);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exported);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // silently fail
    }
  };

  const formatLabels: Record<ExportFormat, string> = {
    css: t("cssVars"),
    scss: "SCSS",
    json: "JSON",
    tailwind: "Tailwind",
  };

  return (
    <>
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-md px-3 py-1.5 transition-colors"
        >
          {t("exportPalette")}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-2">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-black/85 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">{t("exportPalette")}</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors text-lg leading-none"
                aria-label={t("close")}
              >
                ✕
              </button>
            </div>

            {/* Miniaturas das cores */}
            <div className="flex flex-wrap gap-2">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded border border-white/20 flex-shrink-0"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>

            {/* Seletor de formato */}
            <div className="flex gap-1">
              {(["css", "scss", "json", "tailwind"] as ExportFormat[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                    format === f
                      ? "bg-white/20 border-white/40 text-white font-semibold"
                      : "border-white/10 text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {formatLabels[f]}
                </button>
              ))}
            </div>

            {/* Preview */}
            <pre className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white/80 font-mono overflow-x-auto max-h-44 overflow-y-auto whitespace-pre-wrap break-all">
              {exported}
            </pre>

            {/* Botão copiar */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              {copied ? t("exportCopied") : t("copyExport")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
