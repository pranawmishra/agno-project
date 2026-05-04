"use client";

import { DESKS, Desk } from "@/lib/desks";

type Props = {
  userId: string;
  onPick: (q: string, desk: Desk | null) => void;
};

export default function EmptyState({ userId, onPick }: Props) {
  const prompts = DESKS.flatMap((d) =>
    d.exemplars.slice(0, 1).map((q) => ({ d, q })),
  );

  return (
    <section className="fade-up px-5 md:px-7 pt-12 md:pt-20 pb-8">
      <div className="space-y-6">
        <div>
          <span className="meta">welcome, {firstNameOf(userId)}</span>
          <h1 className="font-display italic text-[44px] md:text-[56px] leading-[1.05] tracking-tight text-ink mt-1">
            What would you like to ask?
          </h1>
          <p className="text-ink-2 mt-3 max-w-[52ch] text-[15.5px] leading-relaxed">
            A small team of specialists is on call — finance, news from
            Hacker News, SQL drafting, and a generalist. They'll figure out
            who answers.
          </p>
        </div>

        <div className="pt-2">
          <span className="meta">try</span>
          <ul className="mt-2 divide-y divide-rule-soft border-t border-b border-rule-soft">
            {prompts.map(({ d, q }) => (
              <li key={d.key + q}>
                <button
                  onClick={() => onPick(q, d)}
                  className="prompt-row group w-full flex items-center justify-between gap-4 py-3.5"
                >
                  <span className="text-left text-[15.5px] text-ink-2 group-hover:text-accent transition-colors">
                    {q}
                  </span>
                  <span className="flex items-center gap-3 shrink-0">
                    <span className="meta hidden sm:inline">
                      {d.shortLabel.toLowerCase()}
                    </span>
                    <span className="prompt-arrow text-ink-3 transition-colors">
                      →
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function firstNameOf(userId: string) {
  if (!userId) return "there";
  if (userId.startsWith("READER-")) return "friend";
  return userId.toLowerCase();
}
