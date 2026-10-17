import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PATTERN = "0110100111011010010110100111100101101001";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="overflow-hidden shadow-glow motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
      <CardContent className="grid items-center gap-10 py-6 md:grid-cols-2 md:py-10">
        <div className="space-y-5">
          <p className="text-sm font-medium text-primary">Nieuw rooster</p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-balance sm:text-5xl">Wie woont er hier?</h1>
          <p className="max-w-prose text-lg text-muted-foreground">
            Voeg je huisgenoten toe. Daarna vult ieder per dagdeel in of hij of zij thuis is, en zie je in één oogopslag of
            er vanavond iemand is voor het pakketje, de loodgieter of het eten.
          </p>
          <Button size="lg" onClick={onAdd}>
            <UserPlus />
            Eerste huisgenoot toevoegen
          </Button>
        </div>
        <div aria-hidden="true" className="grid grid-cols-7 gap-1.5 rounded-xl border border-border bg-background/70 p-4">
          {Array.from({ length: 28 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "aspect-square rounded-md border border-border",
                PATTERN[i] === "1" ? "bg-status-home/30" : i % 5 === 0 ? "bg-status-maybe/25" : "bg-muted",
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
