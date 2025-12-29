<script lang="ts">
    import { base } from "$app/paths";
    import type { Post } from "$lib/posts";
    import { CalendarIcon } from "./icons";

    type Props = {
        post: Post;
        onTagClick?: (tag: string) => void;
    };

    let { post, onTagClick }: Props = $props();

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
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
</script>

<a
    href="{base}/posts/{post.slug}"
    class="block bg-card border border-border rounded-[10px] px-6.25 pt-6.25 pb-6.5 hover:border-muted-foreground/30 transition-colors"
>
    <h2
        class="font-medium text-[20px] leading-7.5 text-foreground tracking-[-0.45px] mb-2 line-clamp-1"
    >
        {post.title}
    </h2>

    <p
        class="font-normal text-[16px] leading-6 text-muted-foreground tracking-[-0.31px] mb-2 line-clamp-2"
    >
        {post.description}
    </p>

    <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-1.5">
                <CalendarIcon class="w-4 h-4 text-muted-foreground" />
                <time
                    class="font-normal text-[14px] leading-5 text-muted-foreground tracking-[-0.15px]"
                    datetime={post.date}
                >
                    {formatDate(post.date)}
                </time>
            </div>

            <span
                class="font-normal text-[14px] leading-5 text-muted-foreground tracking-[-0.15px]"
            >
                {post.readingTime} read
            </span>
        </div>

        <div class="flex items-center gap-2">
            {#each post.tags as tag}
                <button
                    type="button"
                    onclick={(e) => handleTagClick(e, tag)}
                    class="bg-secondary text-secondary-foreground text-[12px] leading-4 px-2 py-1 rounded-lg hover:bg-secondary/80 transition-colors"
                >
                    {tag}
                </button>
            {/each}
        </div>
    </div>
</a>
