<script lang="ts">
    import { SearchIcon, TagIcon } from "./icons";

    type Props = {
        searchTerm: string;
        tags: string[];
        onSearch: (term: string) => void;
        onTagClick: (tag: string) => void;
    };

    let { searchTerm, tags, onSearch, onTagClick }: Props = $props();

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        onSearch(target.value);
    }
</script>

<aside class="w-70 shrink-0 flex flex-col gap-6">
    <!-- Search Section -->
    <div class="bg-card border border-border rounded-[10px] p-4.25">
        <h3
            class="text-lg font-medium leading-6.75 text-foreground tracking-[-0.44px] mb-3"
        >
            Search
        </h3>
        <div class="relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon class="size-4 text-muted-foreground" />
            </div>
            <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                oninput={handleInput}
                class="w-full h-9.5 pl-9 pr-3 py-2 bg-secondary border border-border rounded-[10px] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
        </div>
    </div>

    <!-- Tags Section -->
    <div class="bg-card border border-border rounded-[10px] p-4.25">
        <div class="flex items-center gap-2 mb-3">
            <TagIcon class="size-4 text-foreground" />
            <h3
                class="text-lg font-medium leading-6.75 text-foreground tracking-[-0.44px]"
            >
                Tags
            </h3>
        </div>
        <div class="flex flex-wrap gap-2">
            {#each tags as tag}
                <button
                    type="button"
                    onclick={() => onTagClick(tag)}
                    class="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium leading-4 rounded-full hover:bg-secondary/80 transition-colors"
                >
                    {tag}
                </button>
            {/each}
        </div>
    </div>
</aside>
