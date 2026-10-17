import { useCallback, useEffect, useRef, useState } from "react";
import { api, messageOf, type PersonColor, type Schedule, type Status } from "@/lib/api";
import { slotKey } from "@/lib/schedule";

export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(0);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setSchedule(await api.get());
      setError(null);
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Pick up housemates' changes when the tab comes back into view.
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") api.get().then(setSchedule).catch(() => undefined);
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);

  const setSlot = useCallback(async (personId: string, day: number, part: number, status: Status | "") => {
    const key = slotKey(personId, day, part);
    setSchedule((s) => {
      if (!s) return s;
      const slots = { ...s.slots };
      if (status) slots[key] = status;
      else delete slots[key];
      return { ...s, slots };
    });
    const mine = ++seq.current;
    try {
      const next = await api.setSlot(personId, day, part, status);
      if (mine === seq.current) setSchedule(next);
    } catch (e) {
      setError(messageOf(e));
      api.get().then(setSchedule).catch(() => undefined);
    }
  }, []);

  const addPerson = useCallback(async (name: string, color: PersonColor) => {
    setSchedule(await api.addPerson(name, color));
  }, []);

  const removePerson = useCallback(async (id: string) => {
    try {
      setSchedule(await api.removePerson(id));
    } catch (e) {
      setError(messageOf(e));
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { schedule, loading, error, clearError, reload, setSlot, addPerson, removePerson };
}
