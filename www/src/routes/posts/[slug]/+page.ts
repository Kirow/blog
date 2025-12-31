import { error } from "@sveltejs/kit";
import { browser } from "$app/environment";

type Language = "en" | "ua";

function getLanguage(): Language {
  if (browser) {
    const stored = localStorage.getItem("blog-language")?.toLowerCase();
    if (stored === "en" || stored === "ua") {
      return stored;
    }
  }
  return "en";
}

export const load = async ({ params }) => {
  const lang = getLanguage();
  const slug = params.slug;

  // Try to load the post in the preferred language, fallback to English
  const languagesToTry: Language[] =
    lang === "en" ? ["en", "ua"] : [lang, "en"];

  for (const tryLang of languagesToTry) {
    try {
      const post = await import(`../../../posts/${slug}.${tryLang}.md`);
      return {
        content: post.default,
        meta: post.metadata,
        language: tryLang,
      };
    } catch {
      // Try next language
    }
  }

  // Fallback: try without language suffix (for legacy files)
  try {
    const post = await import(`../../../posts/${slug}.md`);
    return {
      content: post.default,
      meta: post.metadata,
      language: "en" as Language,
    };
  } catch {
    error(404, `Could not find ${slug}`);
  }
};
