<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { languageStore } from "$lib/i18n";
</script>

<Button
    variant="secondary"
    size="icon"
    onclick={() => languageStore.toggle()}
    aria-label="Toggle language"
    class="hover:bg-accent hover:text-foreground hover:shadow-md dark:hover:bg-accent/20 focus-visible:ring-2 focus-visible:ring-accent/60 transition-all"
>
    {languageStore.current.toUpperCase()}
</Button>
