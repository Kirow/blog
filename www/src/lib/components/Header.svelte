<script lang="ts">
    import ThemeToggle from "./ThemeToggle.svelte";
    import LanguageToggle from "./LanguageToggle.svelte";
    import { t } from "$lib/i18n";
    import { Button } from "$lib/components/ui/button";
    import { resolve } from "$app/paths";
    import { page } from "$app/stores";

    // Reactive tagline based on language
    let tagline = $derived(t("header.tagline"));
    let backLabel = $derived(t("buttons.back-to-home"));
</script>

<header class="bg-card border-b border-border">
    <div class="px-14 pt-8 pb-8">
        {#if $page.url.pathname.startsWith("/posts/")}
            <!-- Compact header for article pages: back on left, toggles on right -->
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <Button
                        href={resolve("/")}
                        variant="secondary"
                        aria-label="Back to home"
                        class="hover:bg-sky-200 hover:text-foreground hover:shadow-md dark:hover:bg-accent/20 focus-visible:ring-2 focus-visible:ring-accent/60 transition-all"
                    >
                        ← {backLabel}
                    </Button>
                </div>

                <div class="flex items-center gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>
        {:else}
            <div class="flex items-start justify-between">
                <!-- Logo and tagline -->
                <div class="flex flex-col">
                    <h1 class="text-heading-1 text-foreground">TechBlog</h1>
                    <p class="text-body text-muted-foreground">
                        {tagline}
                    </p>
                </div>

                <!-- Controls -->
                <div class="flex items-center gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>
        {/if}
    </div>
</header>
