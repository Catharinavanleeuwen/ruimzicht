import { CircleHelp, DoorOpen, House, type LucideIcon } from "lucide-react";
import type { Person, PersonColor, Schedule, Status } from "@/lib/api";

export const DAYS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
export const DAY_SHORT = ["ma", "di", "wo", "do", "vr", "za", "zo"];

export const PARTS = [
  { label: "Ochtend", short: "Ocht.", hours: "06–12" },
  { label: "Middag", short: "Midd.", hours: "12–18" },
  { label: "Avond", short: "Avond", hours: "18–23" },
  { label: "Nacht", short: "Nacht", hours: "23–06" },
];

export const STATUS_META: Record<Status, { label: string; icon: LucideIcon; tone: string; dot: string }> = {
  thuis: { label: "Thuis", icon: House, tone: "text-status-home", dot: "bg-status-home" },
  weg: { label: "Weg", icon: DoorOpen, tone: "text-muted-foreground", dot: "bg-status-away" },
  misschien: { label: "Misschien", icon: CircleHelp, tone: "text-status-maybe-foreground", dot: "bg-status-maybe" },
};

export const NEXT_STATUS: Record<Status | "", Status | ""> = {
  "": "thuis",
  thuis: "weg",
  weg: "misschien",
  misschien: "",
};

export const COLORS: PersonColor[] = ["terra", "sage", "sky", "plum", "sun", "rose"];

export const COLOR_LABEL: Record<PersonColor, string> = {
  terra: "Terracotta",
  sage: "Salie",
  sky: "Hemelsblauw",
  plum: "Pruim",
  sun: "Oker",
  rose: "Roos",
};

export const PERSON_BG: Record<PersonColor, string> = {
  terra: "bg-person-terra",
  sage: "bg-person-sage",
  sky: "bg-person-sky",
  plum: "bg-person-plum",
  sun: "bg-person-sun",
  rose: "bg-person-rose",
};

export const slotKey = (personId: string, day: number, part: number) => `${personId}:${day}:${part}`;

export interface SlotRef {
  day: number;
  part: number;
}

/** The day (Monday = 0) and part of day for a moment; the night belongs to the evening before. */
export function currentSlot(now: Date): SlotRef {
  const h = now.getHours();
  let day = (now.getDay() + 6) % 7;
  let part = 3;
  if (h >= 6 && h < 12) part = 0;
  else if (h >= 12 && h < 18) part = 1;
  else if (h >= 18 && h < 23) part = 2;
  else if (h < 6) day = (day + 6) % 7;
  return { day, part };
}

export function nextSlot({ day, part }: SlotRef): SlotRef {
  return part === 3 ? { day: (day + 1) % 7, part: 0 } : { day, part: part + 1 };
}

export function peopleWith(schedule: Schedule, day: number, part: number, status: Status | ""): Person[] {
  return schedule.people.filter((p) => (schedule.slots[slotKey(p.id, day, part)] ?? "") === status);
}

export function countHome(schedule: Schedule, personId: string): number {
  let n = 0;
  for (let d = 0; d < 7; d++) for (let p = 0; p < 4; p++) if (schedule.slots[slotKey(personId, d, p)] === "thuis") n++;
  return n;
}
