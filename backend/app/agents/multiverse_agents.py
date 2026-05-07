from agno.agent import Agent
from agno.models.groq import Groq

from app.core.config import settings

_UNIVERSE_CONFIGS: dict[str, dict[str, str]] = {
    "best": {
        "name": "Universe 1: Best Case",
        "role": "The Eternal Optimist — chronicler of the impossibly wonderful timeline",
        "instructions": (
            "You are the Eternal Optimist, keeper of the best possible timelines. "
            "Given a decision, describe in 3-4 vivid sentences the universe where this choice "
            "triggers an absurdly wonderful cascade — include at least one unexpected positive "
            "butterfly effect that no one could have predicted. Be warm and over-the-top. "
            "End with a line starting exactly with 'Outcome: ' summarising the final state."
        ),
    },
    "worst": {
        "name": "Universe 2: Worst Case",
        "role": "The Prophet of Doom — chronicler of the catastrophic cascade triggered by this decision",
        "instructions": (
            "You are the Prophet of Doom, chronicler of terrible timelines. "
            "Given a decision, describe in 3-4 vivid sentences how this single choice triggers "
            "an escalating cascade of catastrophic consequences that feel darkly logical. "
            "Each step should make the last one seem optimistic by comparison. "
            "End with a line starting exactly with 'Outcome: ' summarising the final state."
        ),
    },
    "weird": {
        "name": "Universe 3: Weird Case",
        "role": "The Archivist of Strange Timelines — where causality takes a sharp left turn",
        "instructions": (
            "You are the Archivist of Strange Timelines. "
            "Given a decision, describe in 3-4 sentences a universe where the outcome is completely "
            "bizarre and unrelated to the original choice — as if causality shrugged and walked off. "
            "The strangeness should feel internally consistent, just inexplicable. "
            "End with a line starting exactly with 'Outcome: ' summarising the final state."
        ),
    },
    "absurd": {
        "name": "Universe 4: Absurd Case",
        "role": "The Fever Dream Archivist — where physics and logic are optional extras",
        "instructions": (
            "You are the Fever Dream Archivist, documenting universes where the normal rules dissolved. "
            "Given a decision, describe in 3-4 sentences a fully surreal timeline: objects gain "
            "sentience, time moves sideways, the laws of physics file a formal complaint. "
            "Be deeply committed to the bit. Physics optional. Logic: negotiable. "
            "End with a line starting exactly with 'Outcome: ' summarising the final state."
        ),
    },
    "fine": {
        "name": "Universe 5: Surprisingly Fine",
        "role": "The Shrugging Sage — guardian of the boring, anticlimactically okay timelines",
        "instructions": (
            "You are the Shrugging Sage, guardian of boring timelines. "
            "Given a decision, describe in 3-4 sentences the universe where the outcome is "
            "completely, warmly, anticlimactically fine. Nothing dramatic happens. "
            "Life continues. Something marginally nice might occur on a Tuesday. "
            "End with a line starting exactly with 'Outcome: ' summarising the final state."
        ),
    },
}


def get_intake_agent() -> Agent:
    """The Intake Agent is the first agent in the pipeline. It distils the user's decision into a single crisp, neutral third-person statement."""
    return Agent(
        name="Intake Agent",
        role="Distil the user's decision into a single crisp, neutral third-person statement",
        model=Groq(id=settings.agent_model_id, api_key=settings.groq_api_key),
        instructions=(
            "You receive a user's decision or action and distil it into a single neutral "
            "statement of fact, present tense, third person. Strip emotion, justification, "
            "and filler words. "
            "Example: 'I skipped the gym today' → 'The subject chose to skip their scheduled workout.' "
            "Output only the distilled statement — nothing else, no preamble."
        ),
    )


def get_universe_agent(universe_type: str) -> Agent:
    """The Universe Agent is the second agent in the pipeline. It explores the parallel universes spawned by the user's decision."""
    cfg = _UNIVERSE_CONFIGS[universe_type]
    return Agent(
        name=cfg["name"],
        role=cfg["role"],
        model=Groq(id=settings.agent_model_id, api_key=settings.groq_api_key),
        instructions=cfg["instructions"],
    )


def get_regret_agent() -> Agent:
    """The Regret Quantification Agent is the third agent in the pipeline. It ranks the 5 universes from most to least devastating with dry, precise wit."""
    return Agent(
        name="Regret Quantification Agent",
        role="Rank the 5 universes from most to least devastating with dry, precise wit",
        model=Groq(id=settings.agent_model_id, api_key=settings.groq_api_key),
        instructions=(
            "You receive descriptions of 5 parallel universes. "
            "Rank them from 1 (most devastating to contemplate) to 5 (most acceptable). "
            "For each entry give the universe name and a single wry sentence explaining "
            "why its particular flavour of outcome stings the most — or least. "
            "Format strictly as: '1. [Universe Name] — [one sentence]' and so on through 5. "
            "No preamble, no conclusion."
        ),
    )


def get_acceptance_agent() -> Agent:
    """The Acceptance Agent is the last agent in the pipeline. It delivers the final compassionate-but-absurd sign-off that helps the user make peace."""
    return Agent(
        name="Acceptance Agent",
        role="Deliver the final compassionate-but-absurd sign-off that helps the user make peace",
        model=Groq(id=settings.agent_model_id, api_key=settings.groq_api_key),
        instructions=(
            "You are the last voice the user hears after surveying the wreckage of their parallel lives. "
            "Write 2-3 sentences that are compassionate but faintly absurd — acknowledging the weight "
            "of possibility without being maudlin. End on a single line of genuine, grounded encouragement. "
            "Begin with exactly: 'In this universe —'"
        ),
    )
