<script lang="ts">
    import { page } from "$app/stores";
    import { resolve } from "$app/paths";

    type NavItem = {
        label: string;
        href: string;
    };

    const navItems: NavItem[] = [
        { label: "Home", href: resolve("/") },
        { label: "About", href: resolve("/about") },
        { label: "Contacts", href: resolve("/contacts") },
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
    <nav class="bg-card border border-border rounded-[10px] p-4.25">
        <ul class="flex flex-col gap-2">
            {#each navItems as item}
                {@const active = isActive(item.href, $page.url.pathname)}
                <li>
                    <a
                        href={item.href}
                        class="block px-4 py-2 rounded-[10px] text-base leading-6 tracking-[-0.31px] transition-colors
							{active
                            ? 'bg-accent font-medium text-foreground'
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}"
                    >
                        {item.label}
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
</aside>
