import { STATUS_META } from "@/lib/schedule";
import type { Status } from "@/lib/api";
import { cn } from "@/lib/utils";

const ORDER: Status[] = ["thuis", "misschien", "weg"];

export function Legend() {
  return (
    <ul aria-label="Legenda" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
      {ORDER.map((s) => {
        const meta = STATUS_META[s];
        const Icon = meta.icon;
        return (
          <li key={s} className="flex items-center gap-1.5">
            <Icon className={cn("size-4", meta.tone)} aria-hidden="true" />
            {meta.label}
          </li>
        );
      })}
      <li className="flex items-center gap-1.5">
        <span className="size-3.5 rounded-sm border border-dashed border-border" aria-hidden="true" />
        Niet ingevuld
      </li>
    </ul>
  );
}
