export type Status = "thuis" | "weg" | "misschien";
export type PersonColor = "terra" | "sage" | "sky" | "plum" | "sun" | "rose";

export interface Person {
  id: string;
  name: string;
  color: PersonColor;
}

export interface Schedule {
  people: Person[];
  slots: { [key: string]: Status | undefined };
}

async function request(path: string, init?: RequestInit): Promise<Schedule> {
  let res: Response;
  try {
    res = await fetch(path, { ...init, headers: { "Content-Type": "application/json" } });
  } catch {
    throw new Error("Geen verbinding met de server. Controleer je internet.");
  }
  if (!res.ok) {
    let msg = "Er ging iets mis. Probeer het opnieuw.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) msg = body.error;
    } catch {
      // keep the generic message
    }
    throw new Error(msg);
  }
  return (await res.json()) as Schedule;
}

export const api = {
  get: () => request("/api/schedule"),
  addPerson: (name: string, color: PersonColor) =>
    request("/api/people", { method: "POST", body: JSON.stringify({ name, color }) }),
  removePerson: (id: string) =>
    request(`/api/people/${encodeURIComponent(id)}`, { method: "DELETE" }),
  setSlot: (personId: string, day: number, part: number, status: Status | "") =>
    request("/api/slots", { method: "PUT", body: JSON.stringify({ personId, day, part, status }) }),
};

export function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : "Er ging iets mis. Probeer het opnieuw.";
}
