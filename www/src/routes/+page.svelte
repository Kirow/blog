<script lang="ts">
    import ArticleCard from "$lib/components/ArticleCard.svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import LeftSidebar from "$lib/components/LeftSidebar.svelte";
    import RightSidebar from "$lib/components/RightSidebar.svelte";
    import { Card, CardContent } from "$lib/components/ui/card";

    let { data } = $props();

    let searchTerm = $state("");

    let filteredPosts = $derived(
        data.posts.filter((post) => {
            const term = searchTerm.toLowerCase();
            const matchesTitle = post.title.toLowerCase().includes(term);
            const matchesTags = post.tags.some((tag) =>
                tag.toLowerCase().includes(term),
            );
            return matchesTitle || matchesTags;
        }),
    );

    // Extract all unique tags from posts
    let allTags = $derived(
        [...new Set(data.posts.flatMap((post) => post.tags))].sort(),
    );

    function setTag(tag: string) {
        searchTerm = tag;
    }

    function handleSearch(term: string) {
        searchTerm = term;
    }
</script>

<div class="min-h-screen bg-background flex flex-col">
    <Header />

    <div class="flex-1 px-14 py-8">
        <div class="flex gap-6">
            <!-- Left Sidebar -->
            <LeftSidebar />

            <!-- Main Content -->
            <main class="flex-1 min-w-0">
                <div class="flex flex-col gap-6">
                    {#each filteredPosts as post (post.slug)}
                        <ArticleCard {post} onTagClick={setTag} />
                    {/each}

                    {#if filteredPosts.length === 0}
                        <Card class="rounded-[10px] py-0">
                            <CardContent class="px-6 py-12 text-center">
                                <p class="text-body text-muted-foreground">
                                    No articles found matching "{searchTerm}"
                                </p>
                            </CardContent>
                        </Card>
                    {/if}
                </div>
            </main>

            <!-- Right Sidebar -->
            <RightSidebar
                {searchTerm}
                tags={allTags}
                onSearch={handleSearch}
                onTagClick={setTag}
            />
        </div>
    </div>

    <Footer />
</div>
