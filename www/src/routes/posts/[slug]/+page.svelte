<script lang="ts">
    import { Icon } from "svelte-icon";
    import calendar from "$lib/assets/calendar.svg?raw";
    import { themeStore } from "$lib/stores/theme.svelte";
    import { Card, CardContent } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { resolve } from "$app/paths";

    let { data } = $props();

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
    <title>{data.meta.title} | TechBlog</title>
    <meta name="description" content={data.meta.description} />
</svelte:head>

<div class="min-h-screen bg-background">
    <div class="px-14 py-8">
        <div class="max-w-3xl mx-auto">
            <!-- Back Button -->
            <div class="mb-6">
                <Button
                    href={resolve("/")}
                    variant="ghost"
                    class="text-muted-foreground hover:text-foreground"
                >
                    ← Back to articles
                </Button>
            </div>

            <!-- Article Card -->
            <Card class="rounded-[10px] py-0 gap-0">
                <CardContent class="px-8 py-8">
                    <!-- Article Header -->
                    <header class="mb-8">
                        <h1 class="text-heading-1 text-foreground mb-4">
                            {data.meta.title}
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
                                    datetime={data.meta.date}
                                >
                                    {formatDate(data.meta.date)}
                                </time>
                            </div>

                            {#if data.meta.readingTime}
                                <span
                                    class="text-body-sm text-muted-foreground"
                                >
                                    {data.meta.readingTime} read
                                </span>
                            {/if}
                        </div>

                        <div class="flex flex-wrap gap-2">
                            {#each data.meta.tags as tag}
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
                    <div class="prose prose-slate dark:prose-invert max-w-none">
                        {#if data.content}
                            {@const Content = data.content}
                            <Content />
                        {/if}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</div>
