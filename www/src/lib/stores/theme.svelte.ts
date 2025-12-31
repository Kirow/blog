import { browser } from "$app/environment";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (browser) {
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    applyTheme(initial);
    return initial;
  }
  return "light";
}

function applyTheme(value: Theme) {
  if (browser) {
    // Disable transitions temporarily
    document.documentElement.classList.add("no-transition");
    
    // Apply theme
    if (value === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", value);
    
    // Force reflow, then re-enable transitions
    document.documentElement.offsetHeight;
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("no-transition");
    });
  }
}

function createThemeStore() {
  let theme = $state<Theme>(getInitialTheme());

  return {
    get current() {
      return theme;
    },
    toggle() {
      theme = theme === "light" ? "dark" : "light";
      applyTheme(theme);
    },
    set(value: Theme) {
      theme = value;
      applyTheme(value);
    },
  };
}

export const themeStore = createThemeStore();
