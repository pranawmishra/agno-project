"use client";

import Link from "next/link";

type Props = {
  online: boolean | null;
  onReset: () => void;
  hasMessages: boolean;
};

export default function Header({ online, onReset, hasMessages }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-5 md:px-7 h-14 flex items-center justify-between">
        <div className="flex items-baseline gap-2.5">
          <span className="font-display italic text-[26px] leading-none text-ink">
            Agno
          </span>
          <span
            aria-hidden
            className="inline-block w-1 h-1 rounded-full bg-accent translate-y-[-3px]"
          />
          <span className="meta hidden sm:inline">a quiet studio</span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="meta flex items-center gap-1.5"
            title={
              online === null
                ? "Probing the backend…"
                : online
                ? "Connected to FastAPI"
                : "Backend unreachable"
            }
          >
            <span
              className={
                "inline-block w-1.5 h-1.5 rounded-full " +
                (online === null
                  ? "bg-ink-mute"
                  : online
                  ? "bg-emerald-600"
                  : "bg-accent")
              }
            />
            <span className="hidden sm:inline">
              {online === null
                ? "probing"
                : online
                ? "online"
                : "offline"}
            </span>
          </div>

          <Link href="/multiverse" className="nav-link">
            multiverse
          </Link>

          {hasMessages && (
            <button
              onClick={onReset}
              className="meta hover:text-accent transition-colors px-2 py-1"
            >
              new chat
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 md:px-7">
        <div className="accent-rule" />
      </div>
    </header>
  );
}
