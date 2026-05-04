from agno.team import Team
from agno.team.mode import TeamMode
from agno.models.groq import Groq
from app.agents import get_base_agent, get_finance_agent, get_news_agent, get_sql_agent
from app.core.config import settings
from app.core.db import db
from app.core.memory import get_memory_manager

def get_team() -> Team:
    """Get a team of agents."""
    return Team(
        name="Chat Team",
        mode=TeamMode.route,
        model=Groq(id=settings.team_model_id, api_key=settings.groq_api_key),
        members=[
            get_base_agent(),
            # get_research_agent(),
            get_finance_agent(),
            get_news_agent(),
            get_sql_agent(),
        ],
        instructions=settings.team_instructions,
        db=db,
        memory_manager=get_memory_manager(),
        enable_agentic_memory=True,
        add_datetime_to_context=True,
    )