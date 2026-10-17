import { useState } from "react";
import { useSchedule } from "@/hooks/use-schedule";
import { useNow } from "@/hooks/use-now";
import { NEXT_STATUS, currentSlot, slotKey } from "@/lib/schedule";
import { AppHeader } from "@/components/app-header";
import { NowCard } from "@/components/now-card";
import { PeoplePanel } from "@/components/people-panel";
import { PersonPicker } from "@/components/person-picker";
import { Legend } from "@/components/legend";
import { WeekGrid } from "@/components/week-grid";
import { PersonDialog } from "@/components/person-dialog";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner, LoadFailed, LoadingState } from "@/components/status-states";

export default function App() {
  const { schedule, loading, error, clearError, reload, setSlot, addPerson, removePerson } = useSchedule();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const now = currentSlot(useNow());
  const editing = schedule?.people.find((p) => p.id === editingId) ?? null;

  function cycle(day: number, part: number) {
    if (!editing || !schedule) return;
    const current = schedule.slots[slotKey(editing.id, day, part)] ?? "";
    void setSlot(editing.id, day, part, NEXT_STATUS[current]);
  }

  function startEditing(id: string) {
    setEditingId(id);
    document.getElementById("rooster")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleAdd(name: string, color: Parameters<typeof addPerson>[1]) {
    await addPerson(name, color);
  }

  return (
    <div className="relative min-h-dvh">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-hero" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-dots" />
      <AppHeader onAdd={() => setAddOpen(true)} />

      <main className="mx-auto max-w-6xl space-y-10 px-4 pt-8 pb-20 sm:px-6 sm:pt-12">
        {error && schedule && <ErrorBanner message={error} onClose={clearError} />}

        {loading && !schedule ? (
          <LoadingState />
        ) : !schedule ? (
          <LoadFailed message={error ?? "Onbekende fout."} onRetry={() => void reload()} />
        ) : schedule.people.length === 0 ? (
          <EmptyState onAdd={() => setAddOpen(true)} />
        ) : (
          <>
            <h1 className="sr-only">Ruimzicht: wie is er thuis?</h1>
            <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]" aria-label="Nu">
              <NowCard schedule={schedule} now={now} />
              <PeoplePanel
                schedule={schedule}
                editingId={editingId}
                onEdit={startEditing}
                onRemove={removePerson}
                onAdd={() => setAddOpen(true)}
              />
            </section>

            <section id="rooster" className="scroll-mt-20 space-y-5" aria-labelledby="rooster-title">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl space-y-1.5">
                  <h2 id="rooster-title" className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                    Weekrooster
                  </h2>
                  <p className="text-muted-foreground">
                    {editing ? (
                      <>
                        Je vult de week in voor <strong className="text-foreground">{editing.name}</strong>. Tik op een
                        dagdeel: thuis, weg, misschien, leeg.
                      </>
                    ) : (
                      "Wie is er wanneer thuis? Kies een naam om diens week in te vullen."
                    )}
                  </p>
                </div>
                <Legend />
              </div>
              <PersonPicker people={schedule.people} editingId={editing?.id ?? null} onChange={setEditingId} />
              <WeekGrid schedule={schedule} editing={editing} now={now} onCycle={cycle} />
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-sm text-muted-foreground">
        Ruimzicht · het rooster van jullie huis
      </footer>

      <PersonDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        usedColors={schedule?.people.map((p) => p.color) ?? []}
        onSubmit={handleAdd}
      />
    </div>
  );
}
