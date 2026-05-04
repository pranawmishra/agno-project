from agno.agent import Agent
from agno.models.groq import Groq

from app.core.config import settings


def get_general_agent() -> Agent:
    """Get a general agent with the given instructions and tools."""
    print("Using general agent")
    return Agent(
        model=Groq(id=settings.agent_model_id, api_key=settings.groq_api_key),
    )