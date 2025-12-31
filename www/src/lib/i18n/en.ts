export type TranslationKeys = {
  header: {
    tagline: string;
  };
  nav: {
    home: string;
    about: string;
    contacts: string;
  };
  blog: {
    "read-more": string;
    "reading-time": string;
    "no-posts": string;
    "search-results": string;
  };
  search: {
    title: string;
    placeholder: string;
    "no-results": string;
  };
  tags: {
    title: string;
    all: string;
  };
  buttons: {
    "toggle-theme": string;
    "toggle-language": string;
    "back-to-home": string;
  };
  error: {
    "page-not-found": string;
    "something-went-wrong": string;
    "go-back": string;
  };
  footer: {
    copyright: string;
  };
};

export const en: TranslationKeys = {
  header: {
    tagline: "Insights on modern web development",
  },
  nav: {
    home: "Home",
    about: "About",
    contacts: "Contacts",
  },
  blog: {
    "read-more": "Read more",
    "reading-time": "min read",
    "no-posts": "No posts found",
    "search-results": "Search results",
  },
  search: {
    title: "Search",
    placeholder: "Search articles...",
    "no-results": "No articles found",
  },
  tags: {
    title: "Tags",
    all: "All tags",
  },
  buttons: {
    "toggle-theme": "Toggle theme",
    "toggle-language": "Toggle language",
    "back-to-home": "Back to home",
  },
  error: {
    "page-not-found": "Page not found",
    "something-went-wrong": "Something went wrong",
    "go-back": "Go back",
  },
  footer: {
    copyright: "All rights reserved",
  },
};
