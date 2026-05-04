from agno.agent import Agent
from agno.tools.hackernews import HackerNewsTools

from app.agents.base import get_base_agent

def get_news_agent() -> Agent:
    """Get a news agent with the given instructions and tools."""
    return get_base_agent(
        tools=[HackerNewsTools()],
        name="News Agent",
        role="Get the latest news from Hacker News asked by user",
    )