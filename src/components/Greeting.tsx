"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

export function Greeting() {
  // Datum erst im Browser berechnen, damit die Zeitzone des Nutzers gilt
  const now = useSyncExternalStore(
    noop,
    () => new Date().toDateString(),
    () => null,
  );
  const date = now ? new Date(now) : null;
  const hour = new Date().getHours();
  const hello =
    hour < 11 ? "Guten Morgen" : hour < 18 ? "Hallo" : "Guten Abend";

  return (
    <header className="mb-8">
      <p className="text-sm text-muted">
        {date?.toLocaleDateString("de-DE", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }) ?? " "}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">
        {date ? hello : "Heute"}
      </h1>
    </header>
  );
}
