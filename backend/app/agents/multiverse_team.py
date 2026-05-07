from agno.team import Team
from agno.team.mode import TeamMode
from agno.models.groq import Groq

from app.agents.multiverse_agents import (
    get_acceptance_agent,
    get_intake_agent,
    get_regret_agent,
    get_universe_agent,
)
from app.core.config import settings
from app.core.db import db

_UNIVERSE_SUB_TEAM_INSTRUCTIONS = """
You are the Universe Explorers sub-team. You receive a clean, neutral decision statement.
Broadcast it to all five universe agents simultaneously and return all five timeline
descriptions combined, in this exact order and format — use these headings verbatim:

## Universe 1: Best Case
[verbatim output from Universe 1: Best Case agent]

## Universe 2: Worst Case
[verbatim output from Universe 2: Worst Case agent]

## Universe 3: Weird Case
[verbatim output from Universe 3: Weird Case agent]

## Universe 4: Absurd Case
[verbatim output from Universe 4: Absurd Case agent]

## Universe 5: Surprisingly Fine
[verbatim output from Universe 5: Surprisingly Fine agent]
""".strip()

_COORDINATOR_INSTRUCTIONS = """
You are the Multiverse Council Coordinator. Orchestrate a structured exploration
of parallel universes spawned by the user's decision. Follow this exact sequence:

STEP 1 — Call the "Intake Agent" with the user's raw decision. Use its output as the
         canonical decision statement for all subsequent steps.

STEP 2 — Call the "Universe Explorers" sub-team with the distilled decision statement.
         It will return all five parallel timeline descriptions at once.

STEP 3 — Call the "Regret Quantification Agent" passing the combined universe descriptions
         from Step 2.

STEP 4 — Call the "Acceptance Agent" with the full context from all previous steps.

FINAL OUTPUT — Compile everything into EXACTLY this markdown format. Use these headings
verbatim. Do not add any text before the first heading or after the Acceptance section.
Use the agents' exact outputs — do not paraphrase or summarise.

## Universe 1: Best Case
[from Universe Explorers output]

## Universe 2: Worst Case
[from Universe Explorers output]

## Universe 3: Weird Case
[from Universe Explorers output]

## Universe 4: Absurd Case
[from Universe Explorers output]

## Universe 5: Surprisingly Fine
[from Universe Explorers output]

## Regret Ranking
[verbatim output from Regret Quantification Agent]

## Acceptance
[verbatim output from Acceptance Agent]
""".strip()


def _get_universe_sub_team() -> Team:
    """Inner broadcast team — all 5 universe agents fire in parallel."""
    return Team(
        name="Universe Explorers",
        role="Explore all five parallel timelines simultaneously and return all results",
        mode=TeamMode.coordinate,
        model=Groq(id=settings.agent_model_id, api_key=settings.groq_api_key),
        members=[
            get_universe_agent("best"),
            get_universe_agent("worst"),
            get_universe_agent("weird"),
            get_universe_agent("absurd"),
            get_universe_agent("fine"),
        ],
        instructions=_UNIVERSE_SUB_TEAM_INSTRUCTIONS,
    )


def get_multiverse_team() -> Team:
    """Outer coordinate team — enforces the sequential intake → universes → regret → acceptance flow."""
    return Team(
        name="Multiverse Council",
        mode=TeamMode.coordinate,
        model=Groq(id=settings.team_model_id, api_key=settings.groq_api_key),
        members=[
            get_intake_agent(),
            _get_universe_sub_team(),
            get_regret_agent(),
            get_acceptance_agent(),
        ],
        instructions=_COORDINATOR_INSTRUCTIONS,
        db=db,
        add_datetime_to_context=True,
    )
