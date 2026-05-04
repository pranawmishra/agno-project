"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import Pending from "@/components/Pending";
import Composer from "@/components/Composer";
import {
  AssistantTurn,
  ChatTurn,
  UserTurn,
} from "@/components/Dispatch";
import { Desk, deskFromAgentName, inferDeskFromTools } from "@/lib/desks";
import { getHealth, postChat } from "@/lib/api";
import { makeUserId } from "@/lib/utils";

export default function Page() {
  const [userId, setUserId] = useState<string>("READER-GUEST");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [pending, setPending] = useState(false);
  const [pendingDesk, setPendingDesk] = useState<Desk | null>(null);
  const [preferredDesk, setPreferredDesk] = useState<Desk | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserId(makeUserId());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await getHealth();
        if (!cancelled) setOnline(true);
      } catch {
        if (!cancelled) setOnline(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [turns.length, pending]);

  const send = useCallback(
    async (raw: string, suggestedDesk: Desk | null) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const userTurn: ChatTurn = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        at: new Date(),
      };

      setTurns((t) => [...t, userTurn]);
      setPending(true);
      setPendingDesk(suggestedDesk);

      const messageWithHint = suggestedDesk
        ? `${trimmed}\n\n[reader requests routing to: ${suggestedDesk.agentName}]`
        : trimmed;

      try {
        const resp = await postChat({
          message: messageWithHint,
          user_id: userId,
          session_id: sessionId ?? undefined,
        });

        if (resp.session_id && resp.session_id !== sessionId) {
          setSessionId(resp.session_id);
        }

        const desk =
          suggestedDesk ??
          (resp.member_name
            ? deskFromAgentName(resp.member_name)
            : inferDeskFromTools(resp.team_tools, resp.member_tools)) ??
          deskFromAgentName(null);

        const assistantTurn: ChatTurn = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: resp.content,
          at: new Date(),
          desk,
          teamName: resp.team_name ?? null,
          teamTools: resp.team_tools ?? undefined,
          memberName: resp.member_name ?? null,
          memberTools: resp.member_tools ?? undefined,
          runId: resp.run_id ?? null,
        };

        setTurns((t) => [...t, assistantTurn]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown wire error.";
        const errTurn: ChatTurn = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
          at: new Date(),
          error: msg,
          desk: suggestedDesk ?? undefined,
        };
        setTurns((t) => [...t, errTurn]);
      } finally {
        setPending(false);
        setPendingDesk(null);
        setPreferredDesk(null);
      }
    },
    [userId, sessionId],
  );

  const reset = useCallback(() => {
    setTurns([]);
    setSessionId(null);
    setPreferredDesk(null);
  }, []);

  return (
    <div className="daylight h-screen flex flex-col relative">
      <Header
        online={online}
        onReset={reset}
        hasMessages={turns.length > 0}
      />

      <main
        ref={scrollerRef}
        className="flex-1 overflow-y-auto relative z-10"
      >
        <div className="mx-auto max-w-3xl pb-8">
          {turns.length === 0 && !pending && (
            <EmptyState
              userId={userId}
              onPick={(q, d) => {
                setPreferredDesk(d);
                send(q, d);
              }}
            />
          )}

          <div className="py-2">
            {turns.map((t) =>
              t.role === "user" ? (
                <UserTurn key={t.id} turn={t} />
              ) : (
                <AssistantTurn key={t.id} turn={t} />
              ),
            )}

            {pending && <Pending desk={pendingDesk} />}
          </div>

          <div ref={bottomRef} aria-hidden />
        </div>
      </main>

      <Composer
        onSubmit={send}
        pending={pending}
        preferredDesk={preferredDesk}
        onSelectDesk={setPreferredDesk}
      />
    </div>
  );
}
