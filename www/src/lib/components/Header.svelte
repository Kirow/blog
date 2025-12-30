<script lang="ts">
    import ThemeToggle from "./ThemeToggle.svelte";
    import LanguageToggle from "./LanguageToggle.svelte";
</script>

<header class="bg-card border-b border-border">
    <div class="px-14 pt-8 pb-8">
        <div class="flex items-start justify-between">
            <!-- Logo and tagline -->
            <div class="flex flex-col">
                <h1 class="text-heading-1 text-foreground">TechBlog</h1>
                <p class="text-body text-muted-foreground">
                    Insights on modern web development
                </p>
            </div>

            <!-- Controls -->
            <div class="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
            </div>
        </div>
    </div>
</header>
