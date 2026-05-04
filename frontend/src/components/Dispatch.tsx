"use client";

import { useMemo } from "react";
import { Desk } from "@/lib/desks";
import { renderMarkdown } from "@/lib/markdown";
import { formatTime } from "@/lib/utils";

export type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: Date;
  desk?: Desk;
  teamName?: string | null;
  teamTools?: string[];
  memberName?: string | null;
  memberTools?: string[];
  runId?: string | null;
  error?: string | null;
};

export function UserTurn({ turn }: { turn: ChatTurn }) {
  return (
    <div className="fade-up px-5 md:px-7 py-3 flex justify-end">
      <div className="user-bubble">{turn.content}</div>
    </div>
  );
}

type TraceRowProps = {
  label: string;
  agentName?: string | null;
  tools?: string[];
};

function TraceRow({ label, agentName, tools }: TraceRowProps) {
  if (!agentName && (!tools || tools.length === 0)) return null;
  return (
    <div className="trace-row">
      <span className="trace-label">{label}</span>
      <div className="trace-line">
        {agentName ? (
          <span className="trace-name">{agentName}</span>
        ) : (
          <span className="trace-name trace-name--unknown">—</span>
        )}
        {tools && tools.length > 0 && (
          <>
            <span className="trace-arrow" aria-hidden>
              →
            </span>
            <span className="trace-tools">
              {tools.map((t, i) => (
                <span key={`${t}-${i}`} className="tool-chip">
                  {t}
                </span>
              ))}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function AssistantTurn({ turn }: { turn: ChatTurn }) {
  const html = useMemo(() => renderMarkdown(turn.content), [turn.content]);
  const desk = turn.desk;

  const hasTrace =
    Boolean(turn.teamName) ||
    Boolean(turn.memberName) ||
    Boolean(turn.teamTools && turn.teamTools.length) ||
    Boolean(turn.memberTools && turn.memberTools.length);

  return (
    <article className="fade-up px-5 md:px-7 py-4">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="meta">
          {desk?.shortLabel.toLowerCase() ?? "agno"}
        </span>
        <span className="text-ink-mute">·</span>
        <span className="meta tnum">{formatTime(turn.at)}</span>
      </div>

      {turn.error ? (
        <div className="rounded-xl border border-accent-line bg-[var(--accent-faint)] px-4 py-3">
          <div className="meta text-accent mb-1">couldn't send</div>
          <p className="text-[15px] text-ink-2 leading-relaxed">
            {turn.error}
          </p>
        </div>
      ) : (
        <div
          className="prose-atelier"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}

      {hasTrace && !turn.error && (
        <div className="trace" aria-label="Routing trail">
          <TraceRow
            label="team"
            agentName={turn.teamName}
            tools={turn.teamTools}
          />
          <TraceRow
            label="desk"
            agentName={turn.memberName}
            tools={turn.memberTools}
          />
        </div>
      )}
    </article>
  );
}
