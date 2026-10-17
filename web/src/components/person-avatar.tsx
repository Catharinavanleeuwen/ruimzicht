import { cva, type VariantProps } from "class-variance-authority";
import type { Person } from "@/lib/api";
import { PERSON_BG } from "@/lib/schedule";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-person-foreground ring-2 ring-card select-none",
  {
    variants: {
      size: { xs: "size-5 text-[0.6rem]", sm: "size-8 text-xs", md: "size-10 text-sm" },
    },
    defaultVariants: { size: "sm" },
  },
);

function initials(name: string, max: number): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .map((w) => Array.from(w)[0] ?? "")
    .join("")
    .toUpperCase();
}

interface Props extends VariantProps<typeof avatarVariants> {
  person: Person;
  className?: string;
}

export function PersonAvatar({ person, size, className }: Props) {
  return (
    <span aria-hidden="true" title={person.name} className={cn(avatarVariants({ size }), PERSON_BG[person.color], className)}>
      {initials(person.name, size === "xs" ? 1 : 2)}
    </span>
  );
}
