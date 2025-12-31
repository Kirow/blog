<script lang="ts">
    import { Icon } from "svelte-icon";
    import github from "$lib/assets/github.svg?raw";
    import linkedin from "$lib/assets/linkedin.svg?raw";
    import twitter from "$lib/assets/twitter.svg?raw";
    import { themeStore } from "$lib/stores/theme.svelte";
    import { Button } from "$lib/components/ui/button";
    import { t } from "$lib/i18n";

    type SocialLink = {
        name: string;
        href: string;
        icon: string;
    };

    const socialLinks: SocialLink[] = [
        {
            name: "GitHub",
            href: "https://github.com",
            icon: github,
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com",
            icon: linkedin,
        },
        {
            name: "Twitter",
            href: "https://twitter.com",
            icon: twitter,
        },
    ];

    const currentYear = new Date().getFullYear();

    let copyright = $derived(t("footer.copyright"));
</script>

<footer class="bg-card border-t border-border">
    <div class="px-14 py-6">
        <div class="flex items-center justify-between">
            <!-- Copyright -->
            <p class="text-body-sm text-muted-foreground">
                © {currentYear} TechBlog. {copyright}.
            </p>

            <!-- Social Links -->
            <div class="flex items-center gap-3">
                {#each socialLinks as link}
                    <Button
                        href={link.href}
                        variant="secondary"
                        size="icon"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.name}
                    >
                        <Icon
                            data={link.icon}
                            class="size-5 text-secondary-foreground"
                            stroke={themeStore.current === "light"
                                ? "#314158"
                                : "#D4D4D8"}
                            fill="none"
                        />
                    </Button>
                {/each}
            </div>
        </div>
    </div>
</footer>
