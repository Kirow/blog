<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();
</script>

<svg
	class={className}
	width="16"
	height="16"
	viewBox="0 0 16 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M5.33333 1.33334V3.33334"
		stroke="currentColor"
		stroke-width="1.33333"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M10.6667 1.33334V3.33334"
		stroke="currentColor"
		stroke-width="1.33333"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M2 6H14"
		stroke="currentColor"
		stroke-width="1.33333"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<rect
		x="2"
		y="3.33334"
		width="12"
		height="10.6667"
		rx="2"
		stroke="currentColor"
		stroke-width="1.33333"
	/>
</svg>
