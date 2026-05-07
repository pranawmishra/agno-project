"use client";

import { motion } from "motion/react";

export type UniverseType = "best" | "worst" | "weird" | "absurd" | "fine";

export type Universe = {
  type: UniverseType;
  title: string;
  body: string;
  outcome: string;
};

const TYPE_META: Record<
  UniverseType,
  { label: string; number: string }
> = {
  best: { label: "Best Case", number: "I" },
  worst: { label: "Worst Case", number: "II" },
  weird: { label: "Weird Case", number: "III" },
  absurd: { label: "Absurd Case", number: "IV" },
  fine: { label: "Surprisingly Fine", number: "V" },
};

type Props = {
  universe: Universe;
  index: number;
};

export function UniverseCard({ universe, index }: Props) {
  const meta = TYPE_META[universe.type];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.2, 0.7, 0.3, 1],
      }}
      className={`universe-card universe-card--${universe.type}`}
    >
      <div className="universe-card__header">
        <div className="universe-card__badge">
          <span className="universe-card__indicator" />
          <span className="universe-card__label">{meta.label}</span>
        </div>
        <span className="universe-card__numeral">{meta.number}</span>
      </div>

      <p className="universe-card__body">{universe.body}</p>

      {universe.outcome && (
        <div className="universe-card__outcome">
          <span className="universe-card__outcome-label">Outcome</span>
          <span className="universe-card__outcome-text">{universe.outcome}</span>
        </div>
      )}
    </motion.article>
  );
}
