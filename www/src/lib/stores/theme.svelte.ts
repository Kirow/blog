import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
	let theme = $state<Theme>('light');

	if (browser) {
		const stored = localStorage.getItem('theme') as Theme | null;
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		theme = stored || (prefersDark ? 'dark' : 'light');
		applyTheme(theme);
	}

	function applyTheme(value: Theme) {
		if (browser) {
			if (value === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
			localStorage.setItem('theme', value);
		}
	}

	return {
		get current() {
			return theme;
		},
		toggle() {
			theme = theme === 'light' ? 'dark' : 'light';
			applyTheme(theme);
		},
		set(value: Theme) {
			theme = value;
			applyTheme(theme);
		}
	};
}

export const themeStore = createThemeStore();
