export type ChatRequest = {
  message: string;
  user_id: string;
  session_id?: string | null;
};

export type ChatResponse = {
  content: string;
  session_id?: string | null;
  run_id?: string | null;
  team_name?: string | null;
  team_tools?: string[] | null;
  member_name?: string | null;
  member_tools?: string[] | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export async function postChat(req: ChatRequest, signal?: AbortSignal): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j?.detail ?? JSON.stringify(j);
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(
      `Dispatch failed (${res.status})${detail ? `: ${detail}` : ""}`,
    );
  }

  return (await res.json()) as ChatResponse;
}

export async function getHealth(): Promise<{ status: string; app: string }> {
  const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error("offline");
  return res.json();
}

export type MultiverseRequest = {
  decision: string;
  user_id: string;
};

export type MultiverseResponse = {
  content: string;
  session_id?: string | null;
  run_id?: string | null;
  member_names: string[];
};

export async function postMultiverse(
  req: MultiverseRequest,
  signal?: AbortSignal,
): Promise<MultiverseResponse> {
  const res = await fetch(`${API_BASE}/api/v1/multiverse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j?.detail ?? JSON.stringify(j);
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(
      `Multiverse failed (${res.status})${detail ? `: ${detail}` : ""}`,
    );
  }

  return (await res.json()) as MultiverseResponse;
}
