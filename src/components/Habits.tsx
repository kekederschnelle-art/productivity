"use client";

import { useState } from "react";
import { dayKey, useStored } from "@/lib/store";

export type Habit = { id: string; name: string; days: string[] };

const EMPTY: Habit[] = [];

function lastDays(n: number) {
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

function streak(days: string[]) {
  const set = new Set(days);
  const d = new Date();
  // Heute noch nicht erledigt bricht die Serie nicht ab
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let count = 0;
  while (set.has(dayKey(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export function Habits() {
  const [habits, setHabits] = useStored<Habit[]>("habits", EMPTY);
  const [name, setName] = useState("");
  const week = lastDays(7);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setHabits((prev) => [...prev, { id: crypto.randomUUID(), name: n, days: [] }]);
    setName("");
  }

  const toggle = (id: string, day: string) =>
    setHabits((prev) =>
      prev.map((h) =>
        h.id !== id
          ? h
          : {
              ...h,
              days: h.days.includes(day)
                ? h.days.filter((d) => d !== day)
                : [...h.days, day],
            },
      ),
    );

  const remove = (id: string) =>
    setHabits((prev) => prev.filter((h) => h.id !== id));

  return (
    <section className="card">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Habits</h2>
        <span className="text-sm text-muted">letzte 7 Tage</span>
      </header>

      <form onSubmit={add} className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Neuer Habit, z. B. Lesen"
          className="input flex-1"
        />
        <button type="submit" className="btn">
          Hinzufügen
        </button>
      </form>

      {habits.length === 0 && (
        <p className="py-6 text-center text-sm text-muted">
          Noch keine Habits angelegt.
        </p>
      )}

      <ul className="space-y-3">
        {habits.map((h) => (
          <li key={h.id} className="group">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="font-medium">{h.name}</span>
              <span className="flex items-center gap-3 text-sm text-muted">
                🔥 {streak(h.days)}
                <button
                  onClick={() => remove(h.id)}
                  className="opacity-0 transition group-hover:opacity-100 hover:text-danger"
                  aria-label="Löschen"
                >
                  ✕
                </button>
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {week.map((d) => {
                const key = dayKey(d);
                const on = h.days.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggle(h.id, key)}
                    title={d.toLocaleDateString("de-DE")}
                    className={`flex h-9 flex-col items-center justify-center rounded-md text-[11px] transition ${
                      on
                        ? "bg-accent text-white"
                        : "bg-subtle text-muted hover:bg-border"
                    }`}
                  >
                    {d.toLocaleDateString("de-DE", { weekday: "short" })}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
