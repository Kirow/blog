import { createHighlighter } from "shiki";

// Create a shared highlighter instance
let highlighterPromise = null;

/**
 * Get or create a cached Shiki highlighter instance.
 * This avoids creating multiple highlighters which would be wasteful.
 */
async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [
        "javascript",
        "typescript",
        "svelte",
        "html",
        "css",
        "json",
        "yaml",
        "markdown",
        "bash",
        "shell",
        "python",
        "rust",
        "go",
        "sql",
        "graphql",
        "jsx",
        "tsx",
        "swift",
        "kotlin",
        "java",
        "c",
        "cpp",
        "diff",
        "xml",
        "dockerfile",
        "toml",
        "ini",
      ],
    });
  }
  return highlighterPromise;
}

/**
 * Custom code highlighter function for mdsvex using Shiki.
 * Supports dual themes for light/dark mode switching.
 *
 * @param {string} code - The code to highlight
 * @param {string} lang - The language identifier
 * @returns {Promise<string>} - The highlighted HTML
 */
async function highlightCode(code, lang) {
  const highlighter = await getHighlighter();

  // Handle unknown or empty languages gracefully
  const language = lang || "text";
  const loadedLangs = highlighter.getLoadedLanguages();

  // Fall back to 'text' if language not loaded
  const actualLang = loadedLangs.includes(language) ? language : "text";

  // Generate HTML with dual themes - light theme default, dark theme via CSS class
  const html = highlighter.codeToHtml(code, {
    lang: actualLang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false, // Don't apply default color, let CSS handle it
  });

  return `{@html \`${html.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`}`;
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexConfig = {
  extensions: [".md"],

  // Use Shiki for syntax highlighting
  highlight: {
    highlighter: highlightCode,
  },

  // Smart typography transformations
  smartypants: {
    dashes: "oldschool", // Convert -- to en-dash, --- to em-dash
    quotes: true, // Convert straight quotes to curly quotes
    ellipses: true, // Convert ... to ellipsis
  },

  // Remark plugins for markdown processing
  remarkPlugins: [],

  // Rehype plugins for HTML processing
  rehypePlugins: [],

  // Note: Layouts are not used here because blog posts are rendered
  // as components via dynamic imports in the [slug] route.
  // The styling is handled by the prose-content class in the page component.
  //
  // If you want to use mdsvex layouts for standalone .md pages:
  // layout: {
  //   _: "$lib/components/markdown/MarkdownLayout.svelte",
  //   blog: "$lib/components/markdown/BlogLayout.svelte",
  // },
};

export default mdsvexConfig;
