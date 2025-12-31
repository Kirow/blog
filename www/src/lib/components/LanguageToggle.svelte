<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { languageStore } from "$lib/i18n";
</script>

<Button
    variant="secondary"
    size="sm"
    onclick={() => languageStore.toggle()}
    aria-label="Toggle language"
>
    {languageStore.current.toUpperCase()}
</Button>
