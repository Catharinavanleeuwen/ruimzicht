import { ArrowRight } from "lucide-react";
import type { Person, Schedule } from "@/lib/api";
import { DAYS, PARTS, STATUS_META, nextSlot, peopleWith, type SlotRef } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonAvatar } from "@/components/person-avatar";

function Group({ title, dot, people }: { title: string; dot: string; people: Person[] }) {
  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
        <span className={cn("size-2 rounded-full", dot)} />
        {title}
        <span className="font-normal text-muted-foreground">· {people.length}</span>
      </p>
      {people.length ? (
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
          {people.map((p) => (
            <li key={p.id} className="flex items-center gap-1.5 text-sm">
              <PersonAvatar person={p} size="xs" className="ring-0" />
              {p.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Niemand</p>
      )}
    </div>
  );
}

export function NowCard({ schedule, now }: { schedule: Schedule; now: SlotRef }) {
  const total = schedule.people.length;
  const home = peopleWith(schedule, now.day, now.part, "thuis");
  const maybe = peopleWith(schedule, now.day, now.part, "misschien");
  const away = peopleWith(schedule, now.day, now.part, "weg");
  const unknown = peopleWith(schedule, now.day, now.part, "");
  const next = nextSlot(now);
  const nextHome = peopleWith(schedule, next.day, next.part, "thuis");

  const headline =
    home.length === 0 ? "Niemand thuis" : home.length === total ? "Iedereen is thuis" : `${home.length} van ${total} thuis`;

  return (
    <Card className="relative overflow-hidden shadow-glow motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
      <CardHeader>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-status-home opacity-60 motion-safe:animate-ping" />
            <span className="relative size-2 rounded-full bg-status-home" />
          </span>
          Nu · {DAYS[now.day].toLowerCase()} {PARTS[now.part].label.toLowerCase()}
        </p>
        <CardTitle className="font-display text-4xl font-medium tracking-tight text-balance sm:text-5xl">{headline}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <Group title={STATUS_META.thuis.label} dot={STATUS_META.thuis.dot} people={home} />
        <Group title={STATUS_META.misschien.label} dot={STATUS_META.misschien.dot} people={maybe} />
        <Group title={STATUS_META.weg.label} dot={STATUS_META.weg.dot} people={away} />
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-2 text-sm text-muted-foreground">
        <span>{unknown.length ? `${unknown.length} nog niet ingevuld` : "Iedereen heeft dit dagdeel ingevuld"}</span>
        <span className="flex items-center gap-1.5">
          <ArrowRight className="size-3.5" />
          {PARTS[next.part].label}: {nextHome.length} thuis
        </span>
      </CardFooter>
    </Card>
  );
}
