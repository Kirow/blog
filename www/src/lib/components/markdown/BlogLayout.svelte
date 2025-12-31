<script lang="ts">
	/**
	 * Blog post layout component.
	 * Specialized layout for blog posts with metadata display,
	 * reading time, tags, and article structure.
	 *
	 * This layout is used when frontmatter specifies `layout: blog`
	 * or when rendering blog post content.
	 */

	import { Icon } from 'svelte-icon';
	import calendar from '$lib/assets/calendar.svg?raw';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { Badge } from '$lib/components/ui/badge';

	// Frontmatter props passed from mdsvex
	let {
		title = '',
		description = '',
		date = '',
		tags = [],
		readingTime = '',
		author = '',
		children
	} = $props<{
		title?: string;
		description?: string;
		date?: string;
		tags?: string[];
		readingTime?: string;
		author?: string;
		children?: any;
	}>();

	/**
	 * Format a date string to a human-readable format.
	 */
	function formatDate(dateString: string): string {
		if (!dateString) return '';
		const dateObj = new Date(dateString);
		return dateObj.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	{#if title}
		<title>{title} | TechBlog</title>
	{/if}
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>

<article class="blog-post">
	<!-- Article Header -->
	<header class="blog-header">
		<h1 class="text-heading-1 text-foreground mb-4">{title}</h1>

		<div class="flex items-center gap-4 mb-4">
			{#if date}
				<div class="flex items-center gap-1.5">
					<Icon
						data={calendar}
						class="w-4 h-4"
						stroke={themeStore.current === 'light' ? '#62748E' : '#71717B'}
						fill="none"
					/>
					<time class="text-body-sm text-muted-foreground" datetime={date}>
						{formatDate(date)}
					</time>
				</div>
			{/if}

			{#if readingTime}
				<span class="text-body-sm text-muted-foreground">{readingTime} read</span>
			{/if}

			{#if author}
				<span class="text-body-sm text-muted-foreground">by {author}</span>
			{/if}
		</div>

		{#if tags && tags.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each tags as tag}
					<Badge variant="secondary" class="px-3 py-1.5 text-label">
						{tag}
					</Badge>
				{/each}
			</div>
		{/if}

		{#if description}
			<p class="text-body text-muted-foreground mt-4">{description}</p>
		{/if}
	</header>

	<!-- Article Content -->
	<div class="prose-content">
		{@render children?.()}
	</div>
</article>

<style>
	.blog-post {
		max-width: 48rem; /* 768px - optimal reading width */
		margin: 0 auto;
	}

	.blog-header {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	.prose-content {
		/* Base typography */
		font-size: var(--font-size-base);
		line-height: var(--line-height-relaxed);
		color: var(--foreground);
	}

	/* Prose content styling - Headings */
	.prose-content :global(h1) {
		font-size: var(--font-size-3xl);
		line-height: var(--line-height-tight);
		font-weight: var(--font-weight-bold);
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		color: var(--foreground);
	}

	.prose-content :global(h2) {
		font-size: var(--font-size-2xl);
		line-height: var(--line-height-tight);
		font-weight: var(--font-weight-semibold);
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		color: var(--foreground);
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border);
	}

	.prose-content :global(h3) {
		font-size: var(--font-size-xl);
		line-height: var(--line-height-snug);
		font-weight: var(--font-weight-semibold);
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		color: var(--foreground);
	}

	.prose-content :global(h4) {
		font-size: var(--font-size-lg);
		line-height: var(--line-height-snug);
		font-weight: var(--font-weight-medium);
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
		color: var(--foreground);
	}

	/* Paragraphs */
	.prose-content :global(p) {
		margin-bottom: 1.25rem;
	}

	/* Links */
	.prose-content :global(a) {
		color: var(--primary);
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: opacity 0.15s ease;
	}

	.prose-content :global(a:hover) {
		opacity: 0.8;
	}

	/* Text styles */
	.prose-content :global(strong) {
		font-weight: var(--font-weight-semibold);
		color: var(--foreground);
	}

	.prose-content :global(em) {
		font-style: italic;
	}

	/* Lists */
	.prose-content :global(ul),
	.prose-content :global(ol) {
		margin-bottom: 1.25rem;
		padding-left: 1.5rem;
	}

	.prose-content :global(ul) {
		list-style-type: disc;
	}

	.prose-content :global(ol) {
		list-style-type: decimal;
	}

	.prose-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.prose-content :global(li > ul),
	.prose-content :global(li > ol) {
		margin-top: 0.5rem;
		margin-bottom: 0;
	}

	.prose-content :global(li::marker) {
		color: var(--muted-foreground);
	}

	/* Blockquotes */
	.prose-content :global(blockquote) {
		border-left: 4px solid var(--primary);
		padding-left: 1rem;
		margin: 1.5rem 0;
		font-style: italic;
		color: var(--muted-foreground);
		background-color: var(--muted);
		padding: 1rem 1rem 1rem 1.5rem;
		border-radius: 0 var(--radius) var(--radius) 0;
	}

	.prose-content :global(blockquote p:last-child) {
		margin-bottom: 0;
	}

	/* Horizontal rules */
	.prose-content :global(hr) {
		border: none;
		border-top: 1px solid var(--border);
		margin: 2rem 0;
	}

	/* Inline code */
	.prose-content :global(code:not(pre code)) {
		background-color: var(--muted);
		color: var(--foreground);
		padding: 0.2em 0.4em;
		border-radius: 0.25rem;
		font-size: 0.875em;
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono',
			monospace;
		word-break: break-word;
	}

	/* Code blocks - Shiki integration */
	.prose-content :global(pre) {
		margin: 1.5rem 0;
		border-radius: var(--radius);
		overflow-x: auto;
		border: 1px solid var(--border);
	}

	/* Shiki pre styling */
	.prose-content :global(.shiki) {
		padding: 1rem;
		overflow-x: auto;
	}

	.prose-content :global(pre code) {
		font-size: 0.875rem;
		line-height: 1.7;
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono',
			monospace;
		background: transparent;
		padding: 0;
	}

	/* Tables */
	.prose-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: var(--font-size-sm);
	}

	.prose-content :global(th),
	.prose-content :global(td) {
		border: 1px solid var(--border);
		padding: 0.75rem 1rem;
		text-align: left;
	}

	.prose-content :global(th) {
		background-color: var(--muted);
		font-weight: var(--font-weight-semibold);
	}

	.prose-content :global(tr:nth-child(even)) {
		background-color: color-mix(in srgb, var(--muted) 50%, transparent);
	}

	/* Images */
	.prose-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: var(--radius);
		margin: 1.5rem 0;
		border: 1px solid var(--border);
	}

	.prose-content :global(figure) {
		margin: 1.5rem 0;
	}

	.prose-content :global(figcaption) {
		text-align: center;
		font-size: var(--font-size-sm);
		color: var(--muted-foreground);
		margin-top: 0.5rem;
	}

	/* First paragraph after heading - slightly larger */
	.prose-content :global(h2 + p),
	.prose-content :global(h3 + p) {
		font-size: 1.0625rem;
	}

	/* Task lists */
	.prose-content :global(ul:has(input[type='checkbox'])) {
		list-style-type: none;
		padding-left: 0;
	}

	.prose-content :global(input[type='checkbox']) {
		margin-right: 0.5rem;
		accent-color: var(--primary);
	}

	/* Definition lists */
	.prose-content :global(dl) {
		margin: 1.25rem 0;
	}

	.prose-content :global(dt) {
		font-weight: var(--font-weight-semibold);
		margin-top: 1rem;
	}

	.prose-content :global(dd) {
		margin-left: 1rem;
		color: var(--muted-foreground);
	}

	/* Keyboard shortcuts */
	.prose-content :global(kbd) {
		display: inline-block;
		padding: 0.15em 0.4em;
		font-size: 0.85em;
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono',
			monospace;
		background-color: var(--muted);
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		box-shadow: 0 1px 0 var(--border);
	}

	/* Abbreviations */
	.prose-content :global(abbr[title]) {
		text-decoration: underline dotted;
		cursor: help;
	}

	/* Footnotes */
	.prose-content :global(.footnotes) {
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
		font-size: var(--font-size-sm);
		color: var(--muted-foreground);
	}

	.prose-content :global(.footnotes ol) {
		padding-left: 1.25rem;
	}
</style>
