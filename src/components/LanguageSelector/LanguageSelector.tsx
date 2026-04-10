import type { FC } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "pt-BR", label: "PT" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "ja", label: "JA" },
] as const;

interface IProps {
  compact?: boolean;
}

export const LanguageSelector: FC<IProps> = ({ compact = false }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => handleChange(code)}
            className={`px-2 py-0.5 rounded text-xs border transition-colors ${
              currentLang === code
                ? "bg-white/30 border-white/60 text-white font-semibold"
                : "bg-transparent border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
            aria-pressed={currentLang === code}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-white text-base font-semibold mb-3">{t("language")}</h4>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => handleChange(code)}
            className={`px-3 py-1 rounded-md text-sm border transition-colors ${
              currentLang === code
                ? "bg-white/30 border-white/60 text-white font-semibold"
                : "bg-transparent border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
            aria-pressed={currentLang === code}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const LanguageSelectorDesktop: FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className="hidden md:block fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <h3 className="text-white text-sm font-semibold mb-3">{t("language")}</h3>
      <div className="flex flex-col gap-1">
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => handleChange(code)}
            className={`px-3 py-1 rounded-md text-sm border transition-colors text-left ${
              currentLang === code
                ? "bg-white/30 border-white/60 text-white font-semibold"
                : "bg-transparent border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
            aria-pressed={currentLang === code}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
