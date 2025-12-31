import { languageStore, type Language } from "$lib/stores/language.svelte";
import { en, type TranslationKeys } from "./en";
import { ua } from "./ua";

const translations: Record<Language, TranslationKeys> = {
  en,
  ua,
};

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export type TranslationKey = NestedKeyOf<TranslationKeys>;

/**
 * Get a translation by key with dot notation.
 * Falls back to English if translation is missing.
 *
 * @example
 * t("nav.home") // "Home" or "Головна"
 * t("blog.read-more") // "Read more" or "Читати далі"
 */
export function t(key: TranslationKey): string {
  const lang = languageStore.current;
  const keys = key.split(".");

  let result: unknown = translations[lang];
  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      // Fallback to English
      result = undefined;
      break;
    }
  }

  if (typeof result === "string") {
    return result;
  }

  // Fallback to English
  let fallback: unknown = translations.en;
  for (const k of keys) {
    if (fallback && typeof fallback === "object" && k in fallback) {
      fallback = (fallback as Record<string, unknown>)[k];
    } else {
      return key; // Return key if nothing found
    }
  }

  return typeof fallback === "string" ? fallback : key;
}

/**
 * Get translations object for the current language.
 */
export function getTranslations(): TranslationKeys {
  return translations[languageStore.current];
}

export { languageStore } from "$lib/stores/language.svelte";
export type { Language } from "$lib/stores/language.svelte";

