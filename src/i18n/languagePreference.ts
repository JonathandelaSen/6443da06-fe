export const SUPPORTED_LANGUAGES = ["en", "de"] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

const LANGUAGE_STORAGE_KEY = "osapiens.uiLanguage";

export const normalizeLanguage = (
  language: string | null | undefined
): SupportedLanguage | null => {
  const locale = language?.split("-")[0];

  return SUPPORTED_LANGUAGES.includes(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : null;
};

export const getLanguagePreference = (): SupportedLanguage | null => {
  if (typeof window === "undefined") return null;

  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return null;
  }
};

export const getBrowserLanguage = (): SupportedLanguage | null => {
  if (typeof navigator === "undefined") return null;

  const candidates =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];

  for (const candidate of candidates) {
    const locale = normalizeLanguage(candidate);
    if (locale) return locale;
  }

  return null;
};

export const setLanguagePreference = (language: string): void => {
  if (typeof window === "undefined") return;

  const locale = normalizeLanguage(language);
  if (!locale) return;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // The app can still switch languages when storage is unavailable.
  }
};
