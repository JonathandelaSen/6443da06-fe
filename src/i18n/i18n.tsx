import i18n from "i18next";
import { cloneDeep } from "lodash";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  getBrowserLanguage,
  getLanguagePreference,
  normalizeLanguage,
  setLanguagePreference,
  SUPPORTED_LANGUAGES
} from "./languagePreference";
import de from "./locales/de.json";
import en from "./locales/en.json";

export const FALLBACK_LANGUAGE = DEFAULT_LANGUAGE;

export interface Language {
  locale: string;
  name: string;
  icon: JSX.Element;
}

const translations = { en, de };

export const defaultTranslationModules = SUPPORTED_LANGUAGES.map((locale) => ({
  locale,
  texts: translations[locale]
}));
export const defaultLanguages = defaultTranslationModules.map((m) => m.locale);

const resources = cloneDeep(
  Object.fromEntries(
    defaultTranslationModules.map((m) => [m.locale, { app: m.texts }])
  )
);

i18n.on("languageChanged", (language) => {
  const locale = normalizeLanguage(language);
  if (!locale) return;

  setLanguagePreference(locale);

  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
});

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    ns: ["common", "app"],
    defaultNS: "app",
    lng: getLanguagePreference() || getBrowserLanguage() || FALLBACK_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
