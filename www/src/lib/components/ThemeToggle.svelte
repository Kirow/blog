<script lang="ts">
    import { themeStore } from "$lib/stores/theme.svelte";
    import { SunIcon, MoonIcon } from "./icons";
</script>

<button
    type="button"
    onclick={() => themeStore.toggle()}
    class="flex items-center justify-center size-9 rounded-[10px] bg-secondary hover:bg-secondary/80 transition-colors"
    aria-label="Toggle theme"
>
    {#if themeStore.current === "light"}
        <SunIcon class="size-5 text-secondary-foreground" />
    {:else}
        <MoonIcon class="size-5 text-secondary-foreground" />
    {/if}
</button>
