import { Moon, Sun, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="size-9 text-primary" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <path
        d="M8 15.5 16 9l8 6.5V24a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"
        fill="none"
        stroke="var(--primary-foreground)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="13.5" y="17" width="5" height="5" rx="1" fill="var(--status-maybe)" />
    </svg>
  );
}

export function AppHeader({ onAdd }: { onAdd: () => void }) {
  const { dark, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <Logo />
          <span className="leading-tight">
            <span className="block font-display text-xl font-semibold tracking-tight">Ruimzicht</span>
            <span className="hidden text-xs text-muted-foreground sm:block">Wie is er thuis?</span>
          </span>
        </a>
        <nav aria-label="Acties" className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label={dark ? "Licht thema" : "Donker thema"}>
            {dark ? <Sun /> : <Moon />}
          </Button>
          <Button onClick={onAdd} className="hidden sm:inline-flex">
            <UserPlus />
            Huisgenoot
          </Button>
          <Button onClick={onAdd} size="icon" className="sm:hidden" aria-label="Huisgenoot toevoegen">
            <UserPlus />
          </Button>
        </nav>
      </div>
    </header>
  );
}
