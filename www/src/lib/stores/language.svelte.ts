import { browser } from "$app/environment";

export type Language = "en" | "ua";

const STORAGE_KEY = "blog-language";
const DEFAULT_LANGUAGE: Language = "en";

function getInitialLanguage(): Language {
  if (browser) {
    const stored = localStorage.getItem(STORAGE_KEY)?.toLowerCase() as Language | null;
    if (stored === "en" || stored === "ua") {
      return stored;
    }
  }
  return DEFAULT_LANGUAGE;
}

function createLanguageStore() {
  let language = $state<Language>(getInitialLanguage());

  return {
    get current() {
      return language;
    },
    toggle() {
      language = language === "en" ? "ua" : "en";
      if (browser) {
        localStorage.setItem(STORAGE_KEY, language);
      }
    },
    set(value: Language) {
      language = value;
      if (browser) {
        localStorage.setItem(STORAGE_KEY, language);
      }
    },
  };
}

export const languageStore = createLanguageStore();

