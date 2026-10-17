import { useEffect, useState, type FormEvent } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { messageOf, type PersonColor } from "@/lib/api";
import { COLORS, COLOR_LABEL, PERSON_BG } from "@/lib/schedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usedColors: PersonColor[];
  onSubmit: (name: string, color: PersonColor) => Promise<void>;
}

export function PersonDialog({ open, onOpenChange, usedColors, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<PersonColor>("terra");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName("");
    setError(null);
    setColor(COLORS.find((c) => !usedColors.includes(c)) ?? "terra");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Vul een naam in.");
      return;
    }
    setBusy(true);
    try {
      await onSubmit(trimmed, color);
      onOpenChange(false);
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
          <DialogHeader>
            <DialogTitle>Huisgenoot toevoegen</DialogTitle>
            <DialogDescription>Daarna vul je per dagdeel in wanneer diegene thuis is.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="person-name">Naam</Label>
            <Input
              id="person-name"
              value={name}
              maxLength={40}
              autoFocus
              autoComplete="off"
              placeholder="Bijv. Sanne"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "person-name-error" : undefined}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
            />
            {error && (
              <p id="person-name-error" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
          <fieldset className="grid gap-3">
            <legend className="mb-3 text-sm font-medium">Kleur</legend>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <Button
                  key={c}
                  type="button"
                  variant="swatch"
                  size="icon"
                  aria-pressed={color === c}
                  aria-label={COLOR_LABEL[c]}
                  title={COLOR_LABEL[c]}
                  className={PERSON_BG[c]}
                  onClick={() => setColor(c)}
                >
                  {color === c && <Check />}
                </Button>
              ))}
            </div>
          </fieldset>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={busy}>
              {busy && <LoaderCircle className="animate-spin" />}
              Toevoegen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
