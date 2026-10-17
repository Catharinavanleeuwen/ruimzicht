import { CircleAlert, RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Rooster laden">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <div className="grid gap-2 md:grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-16 md:h-96" />
        ))}
      </div>
    </div>
  );
}

export function LoadFailed({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-4">
        <h1 className="font-display text-3xl font-medium">Het rooster kon niet geladen worden</h1>
        <p className="text-muted-foreground">{message}</p>
        <Button onClick={onRetry}>
          <RotateCw />
          Opnieuw proberen
        </Button>
      </CardContent>
    </Card>
  );
}

export function ErrorBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm motion-safe:animate-in motion-safe:fade-in"
    >
      <CircleAlert className="size-4 shrink-0 text-destructive" aria-hidden="true" />
      <p className="flex-1">{message}</p>
      <Button variant="ghost" size="icon" onClick={onClose} aria-label="Melding sluiten">
        <X />
      </Button>
    </div>
  );
}
