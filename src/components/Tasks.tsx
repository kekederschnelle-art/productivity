"use client";

import { useState } from "react";
import { useStored } from "@/lib/store";

export type Task = { id: string; title: string; done: boolean };

const EMPTY: Task[] = [];

export function Tasks() {
  const [tasks, setTasks] = useStored<Task[]>("tasks", EMPTY);
  const [title, setTitle] = useState("");

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: t, done: false },
    ]);
    setTitle("");
  }

  const toggle = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  const remove = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <section className="card">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Aufgaben</h2>
        <span className="text-sm text-muted">{open.length} offen</span>
      </header>

      <form onSubmit={add} className="mb-4 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Neue Aufgabe …"
          className="input flex-1"
        />
        <button type="submit" className="btn">
          Hinzufügen
        </button>
      </form>

      {tasks.length === 0 && (
        <p className="py-6 text-center text-sm text-muted">
          Noch keine Aufgaben. Leg oben los.
        </p>
      )}

      <ul className="space-y-1">
        {[...open, ...done].map((t) => (
          <li
            key={t.id}
            className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-subtle"
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(t.id)}
              className="size-4 accent-accent"
            />
            <span className={`flex-1 ${t.done ? "text-muted line-through" : ""}`}>
              {t.title}
            </span>
            <button
              onClick={() => remove(t.id)}
              className="text-sm text-muted opacity-0 transition group-hover:opacity-100 hover:text-danger"
              aria-label="Löschen"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
