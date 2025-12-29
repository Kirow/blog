<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
</script>

<header class="bg-card border-b border-border">
	<div class="px-14 pt-8 pb-8">
		<div class="flex items-start justify-between">
			<!-- Logo and tagline -->
			<div class="flex flex-col">
				<h1 class="text-2xl font-medium leading-9 text-foreground tracking-[0.07px]">
					TechBlog
				</h1>
				<p class="text-base font-normal leading-6 text-muted-foreground tracking-[-0.31px]">
					Insights on modern web development
				</p>
			</div>

			<!-- Controls -->
			<div class="flex items-center gap-2">
				<LanguageToggle />
				<ThemeToggle />
			</div>
		</div>
	</div>
</header>
