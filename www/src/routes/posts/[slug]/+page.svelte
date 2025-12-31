<script lang="ts">
    import { Icon } from "svelte-icon";
    import calendar from "$lib/assets/calendar.svg?raw";
    import { themeStore } from "$lib/stores/theme.svelte";
    import { languageStore } from "$lib/i18n";
    import { Badge } from "$lib/components/ui/badge";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { page } from "$app/state";
    import type { Component } from "svelte";

    let { data } = $props();

    // Reference to the article content for adding copy buttons
    let articleRef = $state<HTMLElement | null>(null);

    // Add copy buttons to all code blocks after content renders
    $effect(() => {
        if (articleRef && content) {
            // Small delay to ensure content is rendered
            requestAnimationFrame(() => {
                addCopyButtons();
            });
        }
    });

    function addCopyButtons() {
        if (!articleRef) return;

        const codeBlocks = articleRef.querySelectorAll("pre");

        codeBlocks.forEach((pre) => {
            // Skip if already has a copy button
            if (pre.querySelector(".copy-button")) return;

            // Make pre position relative for absolute positioning of button
            pre.style.position = "relative";

            // Create copy button
            const button = document.createElement("button");
            button.className = "copy-button";
            button.setAttribute("aria-label", "Copy code");
            button.innerHTML = `
                <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;

            button.addEventListener("click", async () => {
                const code = pre.querySelector("code");
                const text = code?.textContent || pre.textContent || "";

                try {
                    await navigator.clipboard.writeText(text);
                    button.classList.add("copied");
                    setTimeout(() => {
                        button.classList.remove("copied");
                    }, 2000);
                } catch (err) {
                    console.error("Failed to copy:", err);
                }
            });

            pre.appendChild(button);
        });
    }

    // Reactive state for post content - derive initial values from data prop
    let contentOverride = $state<Component | null>(null);
    let metaOverride = $state<typeof data.meta | null>(null);

    // Use overrides if set (from language switch), otherwise use data from load
    let content = $derived(contentOverride ?? data.content);
    let meta = $derived(metaOverride ?? data.meta);

    // Re-load post when language changes
    $effect(() => {
        const lang = languageStore.current;
        const slug = page.params.slug;

        if (slug) {
            loadPost(slug, lang);
        }
    });

    async function loadPost(slug: string, lang: "en" | "ua") {
        const languagesToTry = lang === "en" ? ["en", "ua"] : [lang, "en"];

        for (const tryLang of languagesToTry) {
            try {
                const post = await import(
                    `../../../posts/${slug}.${tryLang}.md`
                );
                contentOverride = post.default;
                metaOverride = post.metadata;
                return;
            } catch {
                // Try next language
            }
        }

        // Fallback: try without language suffix (for legacy files)
        try {
            const post = await import(`../../../posts/${slug}.md`);
            contentOverride = post.default;
            metaOverride = post.metadata;
        } catch {
            // Keep existing content if nothing found
        }
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }
</script>

<svelte:head>
    <title>{meta.title} | TechBlog</title>
    <meta name="description" content={meta.description} />
</svelte:head>

<div class="min-h-screen bg-background flex flex-col">
    <Header />

    <div class="flex-1 px-4 md:px-14 py-8">
        <div class="max-w-3xl mx-auto">
            <!-- Article Header -->
            <header class="mb-8 pb-6 border-b border-border">
                <h1 class="text-heading-1 text-foreground mb-4">
                    {meta.title}
                </h1>

                <div class="flex items-center gap-4 mb-4">
                    <div class="flex items-center gap-1.5">
                        <Icon
                            data={calendar}
                            class="w-4 h-4"
                            stroke={themeStore.current === "light"
                                ? "#62748E"
                                : "#71717B"}
                            fill="none"
                        />
                        <time
                            class="text-body-sm text-muted-foreground"
                            datetime={meta.date}
                        >
                            {formatDate(meta.date)}
                        </time>
                    </div>

                    {#if meta.readingTime}
                        <span class="text-body-sm text-muted-foreground">
                            {meta.readingTime} read
                        </span>
                    {/if}
                </div>

                <div class="flex flex-wrap gap-2">
                    {#each meta.tags as tag}
                        <Badge
                            variant="secondary"
                            class="px-3 py-1.5 text-label"
                        >
                            {tag}
                        </Badge>
                    {/each}
                </div>

                {#if meta.description}
                    <p class="text-body text-muted-foreground mt-4">
                        {meta.description}
                    </p>
                {/if}
            </header>

            <!-- Article Content -->
            <article class="prose-content" bind:this={articleRef}>
                {#if content}
                    {@const Content = content}
                    <Content />
                {/if}
            </article>
        </div>
    </div>

    <Footer />
</div>

<style>
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
        padding: 1rem 1rem 1rem 1.5rem;
        margin: 1.5rem 0;
        font-style: italic;
        color: var(--muted-foreground);
        background-color: var(--muted);
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
        background-color: #e2e8f0; /* slate-200 for better contrast in light mode */
        color: var(--foreground);
        padding: 0.2em 0.4em;
        border-radius: 0.25rem;
        font-size: 0.875em;
        font-family:
            ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
            "Liberation Mono", monospace;
        word-break: break-word;
    }

    :global(.dark) .prose-content :global(code:not(pre code)) {
        background-color: var(--muted); /* Keep original for dark mode */
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
        font-family:
            ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
            "Liberation Mono", monospace;
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
    .prose-content :global(ul:has(input[type="checkbox"])) {
        list-style-type: none;
        padding-left: 0;
    }

    .prose-content :global(input[type="checkbox"]) {
        margin-right: 0.5rem;
        accent-color: var(--primary);
    }

    /* Keyboard shortcuts */
    .prose-content :global(kbd) {
        display: inline-block;
        padding: 0.15em 0.4em;
        font-size: 0.85em;
        font-family:
            ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
            "Liberation Mono", monospace;
        background-color: var(--muted);
        border: 1px solid var(--border);
        border-radius: 0.25rem;
        box-shadow: 0 1px 0 var(--border);
    }

    /* Copy button for code blocks */
    .prose-content :global(.copy-button) {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.375rem;
        background-color: var(--muted);
        border: 1px solid var(--border);
        border-radius: 0.375rem;
        cursor: pointer;
        opacity: 0;
        transition:
            opacity 0.15s ease,
            background-color 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--muted-foreground);
        outline: none;
    }

    .prose-content :global(.copy-button:active) {
        border-color: var(--border);
    }

    .prose-content :global(pre:hover .copy-button) {
        opacity: 1;
    }

    .prose-content :global(.copy-button:hover) {
        background-color: var(--secondary);
        color: var(--foreground);
    }

    .prose-content :global(.copy-button:focus) {
        opacity: 1;
    }

    .prose-content :global(.copy-button:focus-visible) {
        outline: 2px solid var(--ring);
        outline-offset: 2px;
    }

    .prose-content :global(.copy-button .copy-icon) {
        display: block;
    }

    .prose-content :global(.copy-button .check-icon) {
        display: none;
    }

    .prose-content :global(.copy-button.copied .copy-icon) {
        display: none;
    }

    .prose-content :global(.copy-button.copied .check-icon) {
        display: block;
        color: #22c55e;
    }

    .prose-content :global(.copy-button.copied) {
        border-color: #22c55e;
    }
</style>
