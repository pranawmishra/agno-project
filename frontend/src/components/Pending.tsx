"use client";

import { Desk } from "@/lib/desks";

export default function Pending({ desk }: { desk: Desk | null }) {
  return (
    <div className="fade-up px-5 md:px-7 py-5 flex items-center gap-2.5 text-ink-3">
      <span className="meta">
        {desk
          ? `${desk.shortLabel.toLowerCase()} is composing`
          : "routing"}
      </span>
      <span className="inline-flex">
        <span className="tdot" />
        <span className="tdot" />
        <span className="tdot" />
      </span>
    </div>
  );
}
