from agno.agent import Agent
from agno.models.groq import Groq

from app.core.config import settings


def get_base_agent(
    # instructions: str | None = None,
    tools: list | None = None,
    name: str | None = None,
    role: str | None = None,
    # enable_agentic_memory: bool = True,
) -> Agent:
    """Get a base agent with the given instructions and tools."""
    print(f": {name or 'Base Agent'} Initialized")
    return Agent(
        name=name or "Base Agent",
        role=role or "Answer the general user's question or help with the general user's task",
        model=Groq(id=settings.agent_model_id, api_key=settings.groq_api_key),
        tools=tools or [],
        # instructions=instructions or settings.agent_instructions,
        # db=db,
        # memory_manager=get_memory_manager(),
        # enable_agentic_memory=enable_agentic_memory,
    )
