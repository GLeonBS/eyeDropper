import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptBR from "./locales/pt-BR.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import ja from "./locales/ja.json";

const savedLanguage = localStorage.getItem("language") ?? "pt-BR";

i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": { translation: ptBR },
    en: { translation: en },
    ru: { translation: ru },
    ja: { translation: ja },
  },
  lng: savedLanguage,
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  document.documentElement.lang = lng;
});

document.documentElement.lang = savedLanguage;

export default i18n;
