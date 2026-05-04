from typing import Annotated

from agno.agent import Agent
from agno.team import Team

from fastapi import Depends

from app.agents.base import get_base_agent
from app.agents.research_agent import get_research_agent
from app.agents.team import get_team

def base_agent() -> Agent:
    return get_base_agent()


def research_agent() -> Agent:
    return get_research_agent()


def team() -> Team:
    return get_team()


# BaseAgentDep = Annotated[Agent, Depends(base_agent)]
# ResearchAgentDep = Annotated[Agent, Depends(research_agent)]
TeamDep = Annotated[Team, Depends(team)]