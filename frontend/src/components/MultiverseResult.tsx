"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { UniverseCard, Universe, UniverseType } from "./UniverseCard";

type Props = {
  content: string;
  memberNames: string[];
  decision: string;
};

type ParsedResult = {
  universes: Universe[];
  regretRanking: string;
  acceptance: string;
};

const UNIVERSE_ORDER: { heading: string; type: UniverseType }[] = [
  { heading: "Universe 1: Best Case", type: "best" },
  { heading: "Universe 2: Worst Case", type: "worst" },
  { heading: "Universe 3: Weird Case", type: "weird" },
  { heading: "Universe 4: Absurd Case", type: "absurd" },
  { heading: "Universe 5: Surprisingly Fine", type: "fine" },
];

function extractSection(content: string, heading: string): string {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `##\\s*${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    "i",
  );
  const match = content.match(regex);
  return match ? match[1].trim() : "";
}

function splitOutcome(text: string): { body: string; outcome: string } {
  const outcomeMatch = text.match(/Outcome:\s*(.+)/i);
  if (!outcomeMatch) return { body: text, outcome: "" };
  const outcome = outcomeMatch[1].trim();
  const body = text.replace(/Outcome:\s*.+/i, "").trim();
  return { body, outcome };
}

function parseContent(content: string): ParsedResult {
  const universes: Universe[] = UNIVERSE_ORDER.map(({ heading, type }) => {
    const raw = extractSection(content, heading);
    const { body, outcome } = splitOutcome(raw);
    return { type, title: heading, body, outcome };
  });

  const regretRanking = extractSection(content, "Regret Ranking");
  const acceptance = extractSection(content, "Acceptance");

  return { universes, regretRanking, acceptance };
}

export function MultiverseResult({ content, memberNames, decision }: Props) {
  const parsed = useMemo(() => parseContent(content), [content]);

  const validUniverses = parsed.universes.filter((u) => u.body.length > 0);
  const hasRanking = parsed.regretRanking.length > 0;
  const hasAcceptance = parsed.acceptance.length > 0;

  if (validUniverses.length === 0) {
    return (
      <div className="multiverse-result">
        <div className="multiverse-section">
          <p className="multiverse-acceptance-text">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="multiverse-result">
      {/* Header */}
      <motion.div
        className="multiverse-result__header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="multiverse-result__title">The Council Has Spoken</h2>
        <p className="multiverse-result__decision">re: &ldquo;{decision}&rdquo;</p>
      </motion.div>

      {/* Universe Cards */}
      <div className="universe-grid">
        {validUniverses.map((u, i) => (
          <UniverseCard key={u.type} universe={u} index={i} />
        ))}
      </div>

      {/* Regret Ranking */}
      {hasRanking && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.6 }}
          className="multiverse-section"
        >
          <h3 className="multiverse-section__title">Regret Ranking</h3>
          <div className="multiverse-section__body">
            {parsed.regretRanking.split("\n").map((line, i) =>
              line.trim() ? (
                <p key={i} className="regret-line">
                  {line}
                </p>
              ) : null,
            )}
          </div>
        </motion.section>
      )}

      {/* Acceptance */}
      {hasAcceptance && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.75 }}
          className="multiverse-section multiverse-section--acceptance"
        >
          <h3 className="multiverse-section__title">Acceptance</h3>
          <p className="multiverse-acceptance-text">{parsed.acceptance}</p>
        </motion.section>
      )}

      {/* Council Trace */}
      {memberNames.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="multiverse-trace"
        >
          <span className="multiverse-trace__label">Council Members</span>
          <div className="multiverse-trace__agents">
            {memberNames.map((name, i) => (
              <span key={`${name}-${i}`} className="multiverse-trace__agent">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
