<script lang="ts">
	import { browser } from '$app/environment';

	type Language = 'EN' | 'RU';

	let currentLang = $state<Language>('EN');

	if (browser) {
		const stored = localStorage.getItem('language') as Language | null;
		if (stored) {
			currentLang = stored;
		}
	}

	function toggleLanguage() {
		currentLang = currentLang === 'EN' ? 'RU' : 'EN';
		if (browser) {
			localStorage.setItem('language', currentLang);
		}
	}
</script>

<button
	type="button"
	onclick={toggleLanguage}
	class="flex items-center justify-center h-8 px-3 rounded-[10px] bg-secondary hover:bg-secondary/80 transition-colors"
	aria-label="Toggle language"
>
	<span class="text-sm font-medium text-secondary-foreground">
		{currentLang}
	</span>
</button>
