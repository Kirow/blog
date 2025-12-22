<script lang="ts">
	let { data } = $props();
	
	let searchTerm = $state('');
	
	let filteredPosts = $derived(
		data.posts.filter(post => {
			const term = searchTerm.toLowerCase();
			const matchesTitle = post.title.toLowerCase().includes(term);
			const matchesTags = post.tags.some(tag => tag.toLowerCase().includes(term));
			return matchesTitle || matchesTags;
		})
	);
	
	function setTag(tag: string) {
		searchTerm = tag;
	}
</script>

<h1>Blog Posts</h1>

<input 
	type="text" 
	placeholder="Search posts..." 
	bind:value={searchTerm}
/>

<ul>
	{#each filteredPosts as post}
		<li>
			<a href="/blog/{post.slug}">{post.title}</a>
			<time>{post.date}</time>
			<div>
				{#each post.tags as tag}
					<button onclick={() => setTag(tag)}>#{tag}</button>
				{/each}
			</div>
		</li>
	{/each}
</ul>
