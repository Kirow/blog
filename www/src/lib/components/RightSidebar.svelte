<script lang="ts">
    import { Icon } from "svelte-icon";
    import search from "$lib/assets/search.svg?raw";
    import tagIcon from "$lib/assets/tag.svg?raw";
    import { themeStore } from "$lib/stores/theme.svelte";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Badge } from "$lib/components/ui/badge";

    type Props = {
        searchTerm: string;
        tags: string[];
        onSearch: (term: string) => void;
        onTagClick: (tag: string) => void;
    };

    let { searchTerm, tags, onSearch, onTagClick }: Props = $props();

    let inputValue = $derived(searchTerm);

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        onSearch(target.value);
    }
</script>

<aside class="w-sidebar-right shrink-0 flex flex-col gap-6">
    <!-- Search Section -->
    <Card class="rounded-[10px] py-0 gap-0">
        <CardHeader class="px-4-25 pt-4-25 pb-3">
            <CardTitle class="text-heading-3 text-foreground">Search</CardTitle>
        </CardHeader>
        <CardContent class="px-4-25 pb-4-25 pt-0">
            <div class="relative">
                <div
                    class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                    <Icon
                        data={search}
                        class="size-4 text-muted-foreground"
                        stroke={themeStore.current === "light"
                            ? "#90A1B9"
                            : "#71717B"}
                        fill="none"
                    />
                </div>
                <Input
                    type="text"
                    placeholder="Search articles..."
                    value={inputValue}
                    oninput={handleInput}
                    class="pl-9 h-9.5 rounded-[10px] bg-secondary"
                />
            </div>
        </CardContent>
    </Card>

    <!-- Tags Section -->
    <Card class="rounded-[10px] py-0 gap-0">
        <CardHeader class="px-4-25 pt-4-25 pb-3">
            <div class="flex items-center gap-2">
                <Icon
                    data={tagIcon}
                    class="size-4 text-foreground"
                    stroke={themeStore.current === "light"
                        ? "#45556C"
                        : "#9F9FA9"}
                    fill="none"
                />
                <CardTitle class="text-heading-3 text-foreground">
                    Tags
                </CardTitle>
            </div>
        </CardHeader>
        <CardContent class="px-4-25 pb-4-25 pt-0">
            <div class="flex flex-wrap gap-2">
                {#each tags as tag}
                    <button type="button" onclick={() => onTagClick(tag)}>
                        <Badge
                            variant="secondary"
                            class="px-3 py-1.5 text-label cursor-pointer hover:bg-secondary/80"
                        >
                            {tag}
                        </Badge>
                    </button>
                {/each}
            </div>
        </CardContent>
    </Card>
</aside>
