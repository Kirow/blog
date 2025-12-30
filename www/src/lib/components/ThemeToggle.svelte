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
</Button>
