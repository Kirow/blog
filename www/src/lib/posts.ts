import type { Language } from "$lib/stores/language.svelte";

export type Post = {
  title: string;
  date: string;
  tags: string[];
  slug: string;
  description: string;
  readingTime: string;
  language: Language;
};

type PostMetadata = {
  title: string;
  date: string;
  tags: string[];
  description: string;
  readingTime: string;
};

/**
 * Parse filename to extract slug and language.
 * Supports both formats:
 * - Language-specific: `post-name.en.md` or `post-name.ua.md`
 * - Language-neutral: `post-name.md` (defaults to 'en')
 */
function parsePostPath(path: string): { slug: string; language: Language } {
  const filename = path.split("/").pop()?.replace(".md", "") || "";

  // Check for language suffix (e.g., "post-name.en" or "post-name.ua")
  const langMatch = filename.match(/^(.+)\.(en|ua)$/);
  if (langMatch) {
    return {
      slug: langMatch[1],
      language: langMatch[2] as Language,
    };
  }

  // Default to English for files without language suffix
  return {
    slug: filename,
    language: "en",
  };
}

/**
 * Get all posts from all languages.
 * Returns posts grouped for later filtering by language.
 */
export async function getAllPosts(): Promise<Post[]> {
  const paths = import.meta.glob("/src/posts/*.md", {
    eager: true,
    import: "metadata",
  });

  const allPosts: Post[] = [];

  for (const [path, file] of Object.entries(paths)) {
    if (!file || typeof file !== "object") {
      throw new Error(`File at ${path} is missing metadata`);
    }

    const { slug, language } = parsePostPath(path);
    const metadata = file as PostMetadata;

    const post: Post = {
      title: metadata.title,
      date: metadata.date,
      tags: metadata.tags,
      description: metadata.description,
      readingTime: metadata.readingTime,
      slug,
      language,
    };

    allPosts.push(post);
  }

  return allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Filter posts by language with English fallback.
 * For each unique slug, returns the post in the target language,
 * or falls back to English if not available.
 */
export function filterPostsByLanguage(posts: Post[], lang: Language): Post[] {
  const postsBySlug = new Map<string, Post[]>();

  // Group by slug
  for (const post of posts) {
    if (!postsBySlug.has(post.slug)) {
      postsBySlug.set(post.slug, []);
    }
    postsBySlug.get(post.slug)!.push(post);
  }

  // Select best post for each slug
  const result: Post[] = [];

  for (const postsForSlug of postsBySlug.values()) {
    const targetPost =
      postsForSlug.find((p) => p.language === lang) ||
      postsForSlug.find((p) => p.language === "en") ||
      postsForSlug[0];

    if (targetPost) {
      result.push(targetPost);
    }
  }

  return result.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get all unique tags across all posts.
 */
export function getAllTags(posts: Post[]): string[] {
  const tags = new Set<string>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }

  return Array.from(tags).sort();
}

// Legacy function for backward compatibility
export async function getPosts(lang?: Language): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return filterPostsByLanguage(allPosts, lang ?? "en");
}
