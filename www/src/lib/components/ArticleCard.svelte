<script lang="ts">
    import { resolve } from "$app/paths";
    import type { Post } from "$lib/posts";
    import { Icon } from "svelte-icon";
    import calendar from "$lib/assets/calendar.svg?raw";
    import { themeStore } from "$lib/stores/theme.svelte";
    import { Card, CardContent } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { t, languageStore } from "$lib/i18n";

    type Props = {
        post: Post;
        onTagClick?: (tag: string) => void;
    };

    let { post, onTagClick }: Props = $props();

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const locale = languageStore.current === "ua" ? "uk-UA" : "en-US";
        return date.toLocaleDateString(locale, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function handleTagClick(event: MouseEvent, tag: string) {
        event.preventDefault();
        event.stopPropagation();
        onTagClick?.(tag);
    }

    let readingTimeLabel = $derived(t("blog.reading-time"));
</script>

<a href={resolve(`/posts/${post.slug}`)} class="block group">
    <Card
        class="rounded-[10px] py-0 gap-0 hover:border-muted-foreground/30 transition-colors"
    >
        <CardContent class="px-6-25 pt-6-25 pb-6-5">
            <h2 class="text-heading-2 text-foreground mb-2 line-clamp-1">
                {post.title}
            </h2>

            <p class="text-body text-muted-foreground mb-2">
                {post.description}
            </p>

            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
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
                            datetime={post.date}
                        >
                            {formatDate(post.date)}
                        </time>
                    </div>

                    <span class="text-body-sm text-muted-foreground">
                        {post.readingTime} {readingTimeLabel}
                    </span>
                </div>

                <div class="flex items-center gap-2">
                    {#each post.tags as tag}
                        <button
                            type="button"
                            onclick={(e) => handleTagClick(e, tag)}
                        >
                            <Badge
                                variant="secondary"
                                class="px-2 py-1 text-caption rounded-lg cursor-pointer hover:bg-secondary/80"
                            >
                                {tag}
                            </Badge>
                        </button>
                    {/each}
                </div>
            </div>
        </CardContent>
    </Card>
</a>
