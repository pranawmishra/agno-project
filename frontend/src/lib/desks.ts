/**
 * The four "desks" of the AGNO DAILY newsroom — one per backend agent.
 * Mapped to the agent names declared in backend/app/agents/*.
 */

export type DeskKey = "general" | "finance" | "news" | "sql";

export type Desk = {
  key: DeskKey;
  agentName: string; // matches backend agent.name
  label: string;
  shortLabel: string;
  number: string;
  role: string;
  beat: string;
  tools: string[];
  signature: string;
  exemplars: string[];
};

export const DESKS: Desk[] = [
  {
    key: "general",
    agentName: "Base Agent",
    label: "The General Desk",
    shortLabel: "General",
    number: "I",
    role: "Answer the general user's question or help with the general user's task",
    beat: "Front-page assignments. Whatever doesn't belong to a specialist desk lands here first.",
    tools: ["reasoning", "general-knowledge"],
    signature: "BASE",
    exemplars: [
      "Help me draft an email to my landlord.",
      "Explain transformers like I'm in a hurry.",
    ],
  },
  {
    key: "finance",
    agentName: "Finance Agent",
    label: "The Finance Desk",
    shortLabel: "Finance",
    number: "II",
    role: "Get the latest information about the stock market, economy, and government asked by user",
    beat: "Markets, tickers, macro indicators, earnings. Powered by Yahoo Finance.",
    tools: ["YFinanceTools"],
    signature: "FIN",
    exemplars: [
      "Quote NVDA and summarize its last earnings.",
      "Compare AAPL and MSFT YTD returns.",
    ],
  },
  {
    key: "news",
    agentName: "News Agent",
    label: "The News Desk",
    shortLabel: "News",
    number: "III",
    role: "Get the latest news from Hacker News asked by user",
    beat: "Frontline dispatches from Hacker News — what's burning on the homepage.",
    tools: ["HackerNewsTools"],
    signature: "HN",
    exemplars: [
      "What's trending on Hacker News today?",
      "Top 5 HN stories about AI safety this week.",
    ],
  },
  {
    key: "sql",
    agentName: "SQL Agent",
    label: "The SQL Desk",
    shortLabel: "SQL",
    number: "IV",
    role: "Convert the user's query into a SQL query",
    beat: "Translates plain English questions into precise SQL — for analysts in a hurry.",
    tools: ["query-translator"],
    signature: "SQL",
    exemplars: [
      "Top 10 customers by revenue last quarter.",
      "Average session length per cohort.",
    ],
  },
];

export function deskFromAgentName(name?: string | null): Desk {
  if (!name) return DESKS[0];
  const found = DESKS.find(
    (d) => d.agentName.toLowerCase() === name.toLowerCase(),
  );
  return found ?? DESKS[0];
}

/** Heuristic: infer the most-likely desk used from the tool names returned. */
export function inferDeskFromTools(
  teamTools?: string[] | null,
  memberTools?: string[] | null,
): Desk {
  const all = [...(teamTools ?? []), ...(memberTools ?? [])]
    .filter(Boolean)
    .map((t) => t.toLowerCase());

  if (all.some((t) => t.includes("yfinance") || t.includes("ticker") || t.includes("stock"))) {
    return DESKS.find((d) => d.key === "finance")!;
  }
  if (all.some((t) => t.includes("hackernews") || t.includes("hn") || t.includes("news"))) {
    return DESKS.find((d) => d.key === "news")!;
  }
  if (all.some((t) => t.includes("sql") || t.includes("query"))) {
    return DESKS.find((d) => d.key === "sql")!;
  }
  return DESKS.find((d) => d.key === "general")!;
}
