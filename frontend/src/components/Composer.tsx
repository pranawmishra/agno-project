"use client";

import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Desk, DESKS } from "@/lib/desks";

type Props = {
  onSubmit: (msg: string, suggestedDesk: Desk | null) => void;
  pending: boolean;
  preferredDesk: Desk | null;
  onSelectDesk: (desk: Desk | null) => void;
};

export default function Composer({
  onSubmit,
  pending,
  preferredDesk,
  onSelectDesk,
}: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = Math.min(ref.current.scrollHeight, 200) + "px";
  }, [value]);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || pending) return;
    onSubmit(trimmed, preferredDesk);
    setValue("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="px-4 md:px-7 pb-5 pt-2 bg-paper border-t border-rule-soft">
      <div className="mx-auto max-w-3xl">
        <div className="composer px-4 pt-3 pb-2.5">
          <div className="flex items-end gap-3">
            <textarea
              ref={ref}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              disabled={pending}
              placeholder={
                preferredDesk
                  ? `Ask ${preferredDesk.shortLabel} something…`
                  : "Ask anything — the right desk will pick it up."
              }
              className="min-h-[28px] max-h-[200px] py-1"
            />
            <button
              onClick={submit}
              disabled={pending || !value.trim()}
              aria-label="Send message"
              className="send-btn shrink-0"
            >
              <SendArrow />
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-rule-soft flex items-center gap-1.5 flex-wrap">
            <span className="meta mr-1">desk</span>
            <button
              type="button"
              data-active={preferredDesk === null}
              onClick={() => onSelectDesk(null)}
              className="chip"
            >
              <span className="chip-dot" />
              auto
            </button>
            {DESKS.map((d) => {
              const active = preferredDesk?.key === d.key;
              return (
                <button
                  key={d.key}
                  type="button"
                  data-active={active}
                  onClick={() => onSelectDesk(active ? null : d)}
                  className="chip"
                >
                  {d.shortLabel.toLowerCase()}
                </button>
              );
            })}
            <span className="meta ml-auto hidden sm:inline">
              <kbd className="font-mono text-[11px] text-ink-2">⏎</kbd> send
              &middot;{" "}
              <kbd className="font-mono text-[11px] text-ink-2">⇧⏎</kbd> new line
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SendArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}
