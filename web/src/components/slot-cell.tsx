import { Plus } from "lucide-react";
import type { Person, Schedule } from "@/lib/api";
import { DAYS, PARTS, STATUS_META, peopleWith, slotKey } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";

interface Props {
  day: number;
  part: number;
  schedule: Schedule;
  editing: Person | null;
  isNow: boolean;
  onCycle: (day: number, part: number) => void;
}

const LEVEL_BG = ["bg-muted/50", "bg-status-home/10", "bg-status-home/20", "bg-status-home/30"];

function PartLabel({ part }: { part: number }) {
  return (
    <span className="text-[0.68rem] font-medium tracking-wide text-muted-foreground uppercase">
      <span className="md:hidden">{PARTS[part].short}</span>
      <span className="hidden md:inline">{PARTS[part].label}</span>
    </span>
  );
}

export function SlotCell({ day, part, schedule, editing, isNow, onCycle }: Props) {
  const where = `${DAYS[day]} ${PARTS[part].label.toLowerCase()}`;

  if (editing) {
    const status = schedule.slots[slotKey(editing.id, day, part)] ?? "";
    const meta = status ? STATUS_META[status] : null;
    const Icon = meta?.icon ?? Plus;
    return (
      <Button
        variant="cell"
        size="cell"
        data-status={status || "leeg"}
        data-now={isNow}
        aria-label={`${where}: ${meta?.label ?? "niet ingevuld"}. Tik om te wijzigen.`}
        onClick={() => onCycle(day, part)}
      >
        <PartLabel part={part} />
        <span className="flex items-center gap-1 text-xs font-medium">
          <Icon className={cn("size-4", meta?.tone ?? "text-muted-foreground")} aria-hidden="true" />
          <span className="hidden lg:inline">{meta?.label ?? "Leeg"}</span>
        </span>
      </Button>
    );
  }

  const home = peopleWith(schedule, day, part, "thuis");
  const maybe = peopleWith(schedule, day, part, "misschien");
  const total = schedule.people.length || 1;
  const level = home.length === 0 ? 0 : Math.min(3, Math.ceil((home.length / total) * 3));

  return (
    <div
      className={cn(
        "flex min-h-16 min-w-0 flex-col justify-between gap-1 rounded-md border border-border p-1.5 transition-colors md:min-h-20 md:p-2",
        LEVEL_BG[level],
        isNow && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      <PartLabel part={part} />
      <div className="flex items-center gap-1" aria-hidden="true">
        <span className="flex -space-x-1.5">
          {home.slice(0, 3).map((p) => (
            <PersonAvatar key={p.id} person={p} size="xs" />
          ))}
        </span>
        {home.length > 3 && <span className="text-[0.65rem] text-muted-foreground">+{home.length - 3}</span>}
        {maybe.length > 0 && <span className="text-[0.65rem] font-semibold text-status-maybe-foreground">?{maybe.length}</span>}
      </div>
      <span className="sr-only">
        {where}: {home.length ? `thuis ${home.map((p) => p.name).join(", ")}` : "niemand thuis"}
        {maybe.length ? `; misschien ${maybe.map((p) => p.name).join(", ")}` : ""}
      </span>
    </div>
  );
}
