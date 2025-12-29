<script lang="ts">
	import { base } from '$app/paths';
	import type { Post } from '$lib/posts';

	type Props = {
		post: Post;
		onTagClick?: (tag: string) => void;
	};

	let { post, onTagClick }: Props = $props();

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
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
	class="block bg-white border border-[#e2e8f0] rounded-[10px] px-[25px] pt-[25px] pb-[26px] hover:border-[#cbd5e1] transition-colors"
>
	<h2
		class="font-medium text-[20px] leading-[30px] text-[#0f172b] tracking-[-0.45px] mb-2 line-clamp-1"
	>
		{post.title}
	</h2>

	<p
		class="font-normal text-[16px] leading-[24px] text-[#45556c] tracking-[-0.31px] mb-2 line-clamp-2"
	>
		{post.description}
	</p>

	<div class="flex items-center justify-between">
		<div class="flex items-center gap-[16px]">
			<div class="flex items-center gap-[6px]">
				<svg
					class="w-4 h-4 text-[#62748e]"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<time
					class="font-normal text-[14px] leading-[20px] text-[#62748e] tracking-[-0.15px]"
					datetime={post.date}
				>
					{formatDate(post.date)}
				</time>
			</div>

			<span class="font-normal text-[14px] leading-[20px] text-[#62748e] tracking-[-0.15px]">
				{post.readingTime} read
			</span>
		</div>

		<div class="flex items-center gap-[8px]">
			{#each post.tags as tag}
				<button
					type="button"
					onclick={(e) => handleTagClick(e, tag)}
					class="bg-[#f1f5f9] text-[#314158] text-[12px] leading-[16px] px-2 py-1 rounded-[4px] hover:bg-[#e2e8f0] transition-colors"
				>
					{tag}
				</button>
			{/each}
		</div>
	</div>
</a>
