import type { Person, Schedule } from "@/lib/api";
import { DAYS, DAY_SHORT, PARTS, type SlotRef } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { SlotCell } from "@/components/slot-cell";

interface Props {
  schedule: Schedule;
  editing: Person | null;
  now: SlotRef;
  onCycle: (day: number, part: number) => void;
}

export function WeekGrid({ schedule, editing, now, onCycle }: Props) {
  return (
    <div className="grid gap-2 md:grid-cols-7">
      {DAYS.map((name, day) => (
        <div
          key={name}
          className="grid grid-cols-[2.75rem_repeat(4,minmax(0,1fr))] items-stretch gap-1.5 md:grid-cols-1 md:gap-2"
        >
          <div
            className={cn(
              "flex items-center text-sm font-semibold md:justify-center md:py-1",
              day === now.day ? "text-primary" : "text-foreground",
            )}
          >
            <span className="capitalize md:hidden">{DAY_SHORT[day]}</span>
            <span className="hidden md:inline">{name}</span>
          </div>
          {PARTS.map((p, part) => (
            <SlotCell
              key={p.label}
              day={day}
              part={part}
              schedule={schedule}
              editing={editing}
              isNow={day === now.day && part === now.part}
              onCycle={onCycle}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
