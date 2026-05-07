# Multiverse Agents

> All agents live in `backend/app/agents/multiverse_agents.py` and are powered by Groq via the Agno framework.

The Multiverse Decision Engine uses **7 agents** in total. One prepares the input, five explore parallel universes, one quantifies your regret, and one sends you home.

---

## 1. Intake Agent

**Factory:** `get_intake_agent()`

The first agent in the pipeline. It receives the user's raw decision — however messily worded — and distills it into a single clean, neutral, third-person statement of fact.

> "I skipped the gym today because I was tired and it was raining" → "The subject chose to skip their scheduled workout."

All five universe agents then receive this cleaned statement as input, ensuring consistency across timelines.

---

## 2. Universe 1: Best Case

**Factory:** `get_universe_agent("best")` · Persona: *The Eternal Optimist*

Narrates the universe where everything goes absurdly, impossibly well. Includes at least one unexpected positive butterfly effect — something no one could have predicted from such a mundane decision. Warm, over-the-top, and oddly convincing.

---

## 3. Universe 2: Worst Case

**Factory:** `get_universe_agent("worst")` · Persona: *The Prophet of Doom*

Traces the escalating catastrophe triggered by the decision. Each consequence makes the previous one look optimistic. The chain of events is darkly logical — not random bad luck, but a coherent cascade of ruin. Devastating, but internally consistent.

---

## 4. Universe 3: Weird Case

**Factory:** `get_universe_agent("weird")` · Persona: *The Archivist of Strange Timelines*

Documents the universe where causality shrugged and walked off. The outcome is completely bizarre and unrelated to the original decision — but the strangeness holds together internally. You cannot explain it. It simply is.

---

## 5. Universe 4: Absurd Case

**Factory:** `get_universe_agent("absurd")` · Persona: *The Fever Dream Archivist*

Covers universes where the normal rules dissolved. Objects gain sentience, time moves sideways, the laws of physics file a formal complaint. Fully surreal, deeply committed to the bit. Physics: optional. Logic: negotiable.

---

## 6. Universe 5: Surprisingly Fine

**Factory:** `get_universe_agent("fine")` · Persona: *The Shrugging Sage*

The anticlimactic timeline. Nothing dramatic happens. Life continues. Something marginally nice might occur on a Tuesday. The Shrugging Sage delivers this news with warm, unhurried calm — as if the other four universes were making a fuss about nothing.

---

## 7. Regret Quantification Agent

**Factory:** `get_regret_agent()`

After all five universes have reported in, this agent ranks them from most to least devastating. Each entry gets a single wry sentence explaining precisely why its flavour of outcome stings the most — or least. No preamble. No conclusion. Just the list.

Output format:
```
1. [Universe Name] — [one sentence]
2. [Universe Name] — [one sentence]
...
```

---

## 8. Acceptance Agent

**Factory:** `get_acceptance_agent()`

The last voice the user hears. After the full wreckage of parallel lives has been surveyed, this agent delivers 2–3 sentences that are compassionate but faintly absurd — acknowledging the weight of possibility without being maudlin. Always begins with `"In this universe —"` and ends on a single line of genuine, grounded encouragement.

---

## How They Fit Together

```
User Input
    │
    ▼
Intake Agent          strips the decision to a clean statement
    │
    ├──────────────────────────────────────────┐
    ▼        ▼        ▼        ▼        ▼      │
 Best     Worst    Weird   Absurd    Fine      │  (all 5 run via coordinator)
    └──────────────────────────────────────────┘
                         │
                         ▼
              Regret Quantification Agent
                         │
                         ▼
                  Acceptance Agent
                         │
                         ▼
                   Frontend Cards
```

The team uses `TeamMode.broadcast` — a single coordinator LLM orchestrates the call sequence, then compiles the final structured markdown that the frontend parses into cards.
