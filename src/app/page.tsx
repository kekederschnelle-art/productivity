import { Greeting } from "@/components/Greeting";
import { Habits } from "@/components/Habits";
import { Tasks } from "@/components/Tasks";

const soon = ["Kalender", "Notizen", "Mails"];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <Greeting />

      <div className="grid gap-6 md:grid-cols-2">
        <Tasks />
        <Habits />
      </div>

      <section className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>Demnächst:</span>
        {soon.map((s) => (
          <span key={s} className="rounded-full border border-border px-3 py-0.5">
            {s}
          </span>
        ))}
      </section>
    </main>
  );
}
