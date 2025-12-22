<script lang="ts">
	let { data } = $props();
</script>

<article>
	<h1>{data.meta.title}</h1>
	<p>Published on {data.meta.date}</p>
	<div>
		{#each data.meta.tags as tag}
			<span>#{tag} </span>
		{/each}
	</div>

	{#if data.content}
		{@const Content = data.content}
		<Content />
	{/if}
</article>
