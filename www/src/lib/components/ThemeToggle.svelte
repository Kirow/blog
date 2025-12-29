<script lang="ts">
    import { themeStore } from "$lib/stores/theme.svelte";
    import { Icon } from "svelte-icon";
    import sun from "$lib/assets/sun.svg?raw";
    import moon from "$lib/assets/moon.svg?raw";
</script>

<button
    type="button"
    onclick={() => themeStore.toggle()}
    class="flex items-center justify-center size-9 rounded-[10px] bg-secondary hover:bg-secondary/80 transition-colors"
    aria-label="Toggle theme"
>
    {#if themeStore.current === "light"}
        <Icon
            data={moon}
            class="size-5 text-secondary-foreground"
            stroke="#314158"
            fill="none"
        />
    {:else}
        <Icon
            data={sun}
            class="size-5 text-secondary-foreground"
            stroke="#FDC700"
            fill="none"
        />
    {/if}
</button>
