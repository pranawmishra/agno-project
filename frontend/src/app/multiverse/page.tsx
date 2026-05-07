"use client";

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { postMultiverse, getHealth } from "@/lib/api";
import { MultiverseResult } from "@/components/MultiverseResult";
import { makeUserId } from "@/lib/utils";

type Result = {
  content: string;
  memberNames: string[];
};

const EXAMPLE_DECISIONS = [
  "I skipped the gym",
  "I said yes to that meeting",
  "I bought the expensive coffee",
  "I didn't reply to that message",
];

const UNIVERSE_TYPES = [
  { key: "best", label: "Best Case" },
  { key: "worst", label: "Worst Case" },
  { key: "weird", label: "Weird Case" },
  { key: "absurd", label: "Absurd Case" },
  { key: "fine", label: "Fine" },
] as const;

export default function MultiVersePage() {
  const [userId] = useState(() => makeUserId());
  const [decision, setDecision] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

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
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 180) + "px";
  }, [decision]);

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, [result]);

  const submit = useCallback(async () => {
    const trimmed = decision.trim();
    if (!trimmed || pending) return;
    setPending(true);
    setError(null);
    setResult(null);

    try {
      const resp = await postMultiverse({ decision: trimmed, user_id: userId });
      setResult({ content: resp.content, memberNames: resp.member_names });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }, [decision, pending, userId]);

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function reset() {
    setDecision("");
    setResult(null);
    setError(null);
    textareaRef.current?.focus();
  }

  return (
    <div className="cosmic">
      {/* Ambient stars */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="cosmic-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Header */}
      <header className="cosmic-header">
        <div className="cosmic-header__inner">
          <Link href="/" className="cosmic-logo">
            Multiverse
          </Link>

          <nav className="cosmic-nav">
            <div className="cosmic-status">
              <span
                className={`cosmic-status__dot ${
                  online === null
                    ? ""
                    : online
                    ? "cosmic-status__dot--online"
                    : "cosmic-status__dot--offline"
                }`}
              />
              <span>{online === null ? "probing" : online ? "online" : "offline"}</span>
            </div>

            <Link href="/" className="cosmic-nav-link">
              ← Exit
            </Link>

            {result && (
              <button onClick={reset} className="cosmic-nav-link">
                Reset
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="pb-16">
        {/* Hero */}
        <AnimatePresence>
          {!result && (
            <motion.section
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
              className="cosmic-hero"
            >
              <motion.div
                className="cosmic-hero__eyebrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Multiverse Decision Engine
              </motion.div>
              <motion.h1
                className="cosmic-hero__title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                What did you just do?
              </motion.h1>
              <motion.p
                className="cosmic-hero__subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Tell the Council your decision. They will consult across five parallel
                universes, quantify your regret, and help you make peace with this
                timeline.
              </motion.p>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Input Portal */}
        <motion.div
          className="cosmic-portal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="cosmic-portal__container">
            <textarea
              ref={textareaRef}
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              disabled={pending}
              placeholder="Describe your decision..."
              className="cosmic-portal__textarea"
            />

            <div className="cosmic-portal__footer">
              <div className="cosmic-examples">
                {EXAMPLE_DECISIONS.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setDecision(ex);
                      textareaRef.current?.focus();
                    }}
                    disabled={pending}
                    className="cosmic-example"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              <button
                onClick={submit}
                disabled={pending || !decision.trim()}
                className="cosmic-submit"
              >
                <span className="cosmic-submit__text">
                  {pending ? "Consulting the Council..." : "Collapse the Wave Function"}
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {pending && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="cosmic-loading"
            >
              <p className="cosmic-loading__title">Consulting across parallel dimensions...</p>

              <div className="cosmic-loading__grid">
                {UNIVERSE_TYPES.map(({ key, label }, i) => (
                  <motion.div
                    key={key}
                    className="cosmic-loading__item"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                  >
                    <motion.div
                      className={`cosmic-loading__orb cosmic-loading__orb--${key}`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="cosmic-loading__label">{label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && !pending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="cosmic-error"
            >
              <div className="cosmic-error__title">Council Unreachable</div>
              <p className="cosmic-error__message">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {result && !pending && (
          <motion.div
            ref={resultRef}
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <MultiverseResult
              content={result.content}
              memberNames={result.memberNames}
              decision={decision}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}
