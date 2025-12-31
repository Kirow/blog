<script lang="ts">
    import { themeStore } from "$lib/stores/theme.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Icon } from "svelte-icon";
    import sun from "$lib/assets/sun.svg?raw";
    import moon from "$lib/assets/moon.svg?raw";
</script>

<Button
    variant="secondary"
    size="icon"
    onclick={() => themeStore.toggle()}
    aria-label="Toggle theme"
    class="hover:bg-accent hover:text-foreground hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent/60 transition-all dark:hover:bg-accent/20"
>
    {#if themeStore.current === "light"}
        <Icon
            data={moon}
            class="size-5 text-secondary-foreground"
            stroke="currentColor"
            fill="none"
        />
    {:else}
        <Icon
            data={sun}
            class="size-5 text-warning"
            stroke="currentColor"
            fill="none"
        />
    {/if}
</Button>
