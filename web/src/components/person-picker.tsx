import { Users } from "lucide-react";
import type { Person } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";

interface Props {
  people: Person[];
  editingId: string | null;
  onChange: (id: string | null) => void;
}

export function PersonPicker({ people, editingId, onChange }: Props) {
  return (
    <div role="group" aria-label="Rooster bekijken of invullen" className="flex flex-wrap gap-2">
      <Button variant="chip" size="chip" aria-pressed={editingId === null} onClick={() => onChange(null)}>
        <Users />
        Overzicht
      </Button>
      {people.map((p) => (
        <Button key={p.id} variant="chip" size="chip" aria-pressed={editingId === p.id} onClick={() => onChange(p.id)}>
          <PersonAvatar person={p} size="xs" className="ring-0" />
          {p.name}
        </Button>
      ))}
    </div>
  );
}
