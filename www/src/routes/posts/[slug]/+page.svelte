<script lang="ts">
    import { Icon } from "svelte-icon";
    import calendar from "$lib/assets/calendar.svg?raw";
    import { themeStore } from "$lib/stores/theme.svelte";
    import { languageStore } from "$lib/i18n";
    import { Badge } from "$lib/components/ui/badge";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { page } from "$app/stores";
    import type { Component } from "svelte";

    let { data } = $props();

    // Reactive state for post content
    let content = $state<Component | null>(data.content);
    let meta = $state(data.meta);

    // Re-load post when language changes
    $effect(() => {
        const lang = languageStore.current;
        const slug = $page.params.slug;

        loadPost(slug, lang);
    });

    async function loadPost(slug: string, lang: "en" | "ua") {
        const languagesToTry = lang === "en" ? ["en", "ua"] : [lang, "en"];

        for (const tryLang of languagesToTry) {
            try {
                const post = await import(
                    `../../../posts/${slug}.${tryLang}.md`
                );
                content = post.default;
                meta = post.metadata;
                return;
            } catch {
                // Try next language
            }
        }

        // Fallback: try without language suffix (for legacy files)
        try {
            const post = await import(`../../../posts/${slug}.md`);
            content = post.default;
            meta = post.metadata;
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

    <div class="flex-1 px-14 py-8">
        <div class="max-w-3xl mx-auto">
            <!-- Article Header -->
            <header class="mb-8">
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
            </header>

            <!-- Article Content -->
            <article class="prose prose-slate dark:prose-invert max-w-none">
                {#if content}
                    {@const Content = content}
                    <Content />
                {/if}
            </article>
        </div>
    </div>

    <Footer />
</div>
