<script lang="ts">
	/**
	 * Default markdown layout component.
	 * Wraps markdown content with proper styling and structure.
	 *
	 * This layout is used for general markdown files that don't specify
	 * a specific layout in their frontmatter.
	 */

	// Frontmatter props passed from mdsvex
	let {
		title = '',
		description = '',
		children
	} = $props<{
		title?: string;
		description?: string;
		children?: any;
	}>();
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
	{/if}
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>

<article class="markdown-content">
	{#if title}
		<header class="markdown-header">
			<h1 class="text-heading-1 text-foreground mb-4">{title}</h1>
			{#if description}
				<p class="text-body text-muted-foreground">{description}</p>
			{/if}
		</header>
	{/if}

	<div class="prose-content">
		{@render children?.()}
	</div>
</article>

<style>
	.markdown-content {
		max-width: 65ch;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.markdown-header {
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border);
	}

	.prose-content {
		/* Base typography */
		font-size: var(--font-size-base);
		line-height: var(--line-height-relaxed);
		color: var(--foreground);
	}

	/* Prose content styling */
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

	.prose-content :global(p) {
		margin-bottom: 1.25rem;
	}

	.prose-content :global(a) {
		color: var(--primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.prose-content :global(a:hover) {
		opacity: 0.8;
	}

	.prose-content :global(strong) {
		font-weight: var(--font-weight-semibold);
		color: var(--foreground);
	}

	.prose-content :global(em) {
		font-style: italic;
	}

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

	.prose-content :global(blockquote) {
		border-left: 4px solid var(--border);
		padding-left: 1rem;
		margin: 1.5rem 0;
		font-style: italic;
		color: var(--muted-foreground);
	}

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
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
			"Liberation Mono", monospace;
	}

	/* Code blocks */
	.prose-content :global(pre) {
		margin: 1.5rem 0;
		border-radius: var(--radius);
		overflow-x: auto;
	}

	.prose-content :global(pre code) {
		font-size: 0.875rem;
		line-height: 1.7;
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
			"Liberation Mono", monospace;
	}

	/* Tables */
	.prose-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
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
		background-color: var(--muted);
		opacity: 0.5;
	}

	/* Images */
	.prose-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: var(--radius);
		margin: 1.5rem 0;
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
</style>
