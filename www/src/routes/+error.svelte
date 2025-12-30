<script lang="ts">
    import { page } from "$app/state";
    import { resolve } from "$app/paths";
    import { Icon } from "svelte-icon";
    import warningIcon from "$lib/assets/404-warning.svg?raw";
    import homeIcon from "$lib/assets/home.svg?raw";
    import { Button } from "$lib/components/ui/button";
    // required? to apply correct styles based on the current theme
    import { themeStore } from "$lib/stores/theme.svelte";
</script>

<svelte:head>
    <title>Error {page.status} | Blog</title>
</svelte:head>

<div
    class="bg-background text-foreground flex min-h-screen flex-col items-center justify-center font-sans"
>
    <!-- Icon Container -->
    <div
        class="bg-secondary dark:bg-card mb-8 flex h-28 w-28 items-center justify-center rounded-full"
    >
        <Icon
            data={warningIcon}
            size="65px"
            fill="none"
            stroke="var(--muted-foreground)"
        />
    </div>

    <!-- Error Status -->
    <h1 class="text-heading-1 text-muted-foreground mb-4">
        {page.status}
    </h1>

    <!-- Error Title -->
    <h2 class="text-heading-2 text-muted-foreground mb-2">
        {page.status === 404 ? "Page Not Found" : "Something Went Wrong"}
    </h2>

    <!-- Description -->
    <p class="text-body text-secondary-foreground mb-8 text-center">
        {page.status === 404
            ? "Sorry, the page you're looking for doesn't exist or has been moved."
            : "An unexpected error occurred. Please try again later."}
    </p>

    <!-- Button -->
    <Button href={resolve("/")} size="lg" class="gap-2">
        <Icon data={homeIcon} fill="none" stroke="var(--primary-foreground)" />
        <span class="text-body font-medium">Back to Home</span>
    </Button>
</div>
