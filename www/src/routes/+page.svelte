<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';

	let { data } = $props();

	let searchTerm = $state('');

	let filteredPosts = $derived(
		data.posts.filter((post) => {
			const term = searchTerm.toLowerCase();
			const matchesTitle = post.title.toLowerCase().includes(term);
			const matchesTags = post.tags.some((tag) => tag.toLowerCase().includes(term));
			return matchesTitle || matchesTags;
		})
	);

	function setTag(tag: string) {
		searchTerm = tag;
	}
</script>

<div class="flex flex-col gap-6">
	{#each filteredPosts as post (post.slug)}
		<ArticleCard {post} onTagClick={setTag} />
	{/each}
</div>
