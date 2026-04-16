import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  history: string[];
  onUseColor: (color: string) => void;
  onClear: () => void;
  compact?: boolean;
}

export const ColorHistory: FC<IProps> = ({
  history,
  onUseColor,
  onClear,
  compact = false,
}) => {
  const { t } = useTranslation();

  if (history.length === 0) return null;

  return (
    <section className={`border-t border-white/10 ${compact ? "pt-2" : "pt-3 md:pt-4"}`}>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wide">
          {t("colorHistory")}
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-white/40 hover:text-white/80 text-xs transition-colors"
          aria-label={t("clearHistory")}
        >
          {t("clearHistory")}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center px-1">
        {history.map((color, i) => (
          <button
            key={`${color}-${i}`}
            type="button"
            onClick={() => onUseColor(color)}
            className={`rounded-md border-2 border-white/20 hover:border-white/70 transition-all hover:scale-110 focus:outline-none focus:border-white/60 ${
              compact ? "w-8 h-8" : "w-10 h-10"
            }`}
            style={{ backgroundColor: color }}
            title={color}
            aria-label={`${t("useColor")}: ${color}`}
          />
        ))}
      </div>
    </section>
  );
};
