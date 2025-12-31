<script lang="ts">
    import { page } from "$app/stores";
    import { resolve } from "$app/paths";
    import { Card, CardContent } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { t } from "$lib/i18n";

    type NavItem = {
        labelKey: "nav.home" | "nav.about" | "nav.contacts";
        href: string;
    };

    const navItems: NavItem[] = [
        { labelKey: "nav.home", href: resolve("/") },
        { labelKey: "nav.about", href: resolve("/about") },
        { labelKey: "nav.contacts", href: resolve("/contacts") },
    ];

    function isActive(href: string, currentPath: string): boolean {
        if (href === resolve("/")) {
            return (
                currentPath === resolve("/") ||
                currentPath === resolve("/").replace(/\/$/, "")
            );
        }
        return currentPath.startsWith(href);
    }
</script>

<aside class="w-60 shrink-0">
    <Card class="rounded-[10px] py-0 gap-0">
        <CardContent class="p-4-25">
            <nav>
                <ul class="flex flex-col gap-2">
                    {#each navItems as item}
                        {@const active = isActive(
                            item.href,
                            $page.url.pathname
                        )}
                        <li>
                            <Button
                                href={item.href}
                                variant={active ? "default" : "ghost"}
                                class="w-full justify-start text-body {active
                                    ? 'bg-accent dark:bg-sidebar-accent dark:text-sidebar-accent-foreground text-foreground font-medium hover:bg-accent/90 dark:hover:bg-sidebar-accent'
                                    : 'text-muted-foreground hover:text-foreground'}"
                            >
                                {t(item.labelKey)}
                            </Button>
                        </li>
                    {/each}
                </ul>
            </nav>
        </CardContent>
    </Card>
</aside>
