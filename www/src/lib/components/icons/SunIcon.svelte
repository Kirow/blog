<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: className = 'w-5 h-5' }: Props = $props();
</script>

<svg
	class={className}
	viewBox="0 0 20 20"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<!-- Center circle -->
	<circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5" />
	<!-- Top ray -->
	<line x1="10" y1="1.67" x2="10" y2="3.33" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	<!-- Bottom ray -->
	<line x1="10" y1="16.67" x2="10" y2="18.33" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	<!-- Left ray -->
	<line x1="1.67" y1="10" x2="3.33" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	<!-- Right ray -->
	<line x1="16.67" y1="10" x2="18.33" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	<!-- Top-left ray -->
	<line x1="4.11" y1="4.11" x2="5.29" y2="5.29" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	<!-- Top-right ray -->
	<line x1="14.71" y1="5.29" x2="15.89" y2="4.11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	<!-- Bottom-left ray -->
	<line x1="4.11" y1="15.89" x2="5.29" y2="14.71" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	<!-- Bottom-right ray -->
	<line x1="14.71" y1="14.71" x2="15.89" y2="15.89" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
