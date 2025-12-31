import type { TranslationKeys } from "./en";

export const ua: TranslationKeys = {
  header: {
    tagline: "Інсайти про сучасну веб-розробку",
  },
  nav: {
    home: "Головна",
    about: "Про мене",
    contacts: "Контакти",
  },
  blog: {
    "read-more": "Читати далі",
    "reading-time": "хв читання",
    "no-posts": "Публікації не знайдено",
    "search-results": "Результати пошуку",
  },
  search: {
    title: "Пошук",
    placeholder: "Шукати статті...",
    "no-results": "Статті не знайдено",
  },
  tags: {
    title: "Теги",
    all: "Всі теги",
  },
  buttons: {
    "toggle-theme": "Змінити тему",
    "toggle-language": "Змінити мову",
    "back-to-home": "На головну",
  },
  error: {
    "page-not-found": "Сторінку не знайдено",
    "something-went-wrong": "Щось пішло не так",
    "go-back": "Повернутися",
  },
  footer: {
    copyright: "Всі права захищено",
  },
} as const;

