<script lang="ts">
    import { browser } from "$app/environment";
    import { Button } from "$lib/components/ui/button";

    type Language = "EN" | "UA";

    let currentLang = $state<Language>("EN");

    if (browser) {
        const stored = localStorage.getItem("language") as Language | null;
        if (stored) {
            currentLang = stored;
        }
    }

    function toggleLanguage() {
        currentLang = currentLang === "EN" ? "UA" : "EN";
        if (browser) {
            localStorage.setItem("language", currentLang);
        }
    }
</script>

<Button
    variant="secondary"
    size="sm"
    onclick={toggleLanguage}
    aria-label="Toggle language"
>
    {currentLang}
</Button>
