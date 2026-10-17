import { useState } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import type { Schedule } from "@/lib/api";
import { countHome } from "@/lib/schedule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonAvatar } from "@/components/person-avatar";

interface Props {
  schedule: Schedule;
  editingId: string | null;
  onEdit: (id: string) => void;
  onRemove: (id: string) => Promise<void>;
  onAdd: () => void;
}

export function PeoplePanel({ schedule, editingId, onEdit, onRemove, onAdd }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const n = schedule.people.length;

  return (
    <Card className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
      <CardHeader>
        <CardTitle className="font-display text-2xl font-medium">Huisgenoten</CardTitle>
        <CardDescription>
          {n} {n === 1 ? "persoon" : "personen"} in dit huis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {schedule.people.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-2.5">
              <PersonAvatar person={p} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{countHome(schedule, p.id)} van 28 dagdelen thuis</p>
              </div>
              {confirmId === p.id ? (
                <>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setConfirmId(null);
                      void onRemove(p.id);
                    }}
                  >
                    Verwijderen
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                    Nee
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant={editingId === p.id ? "secondary" : "outline"} onClick={() => onEdit(p.id)}>
                    <Pencil />
                    <span className="sr-only sm:not-sr-only">Invullen</span>
                  </Button>
                  <Button size="icon" variant="ghost" aria-label={`${p.name} verwijderen`} onClick={() => setConfirmId(p.id)}>
                    <Trash2 />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button variant="outline" className="w-full" onClick={onAdd}>
          <UserPlus />
          Huisgenoot toevoegen
        </Button>
      </CardFooter>
    </Card>
  );
}
