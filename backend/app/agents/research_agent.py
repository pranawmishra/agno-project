from agno.agent import Agent
from agno.tools.websearch import WebSearchTools
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.tavily import TavilyTools
from app.core.config import settings

from app.agents.base import get_base_agent

RESEARCH_INSTRUCTIONS = (
    "You are a knowledgeable research assistant with access to real-time web search. "
    "When answering questions, search the web for the latest and most accurate information. "
    "Always cite your sources clearly. Synthesize information from multiple results when relevant. "
    "If you already know the answer with high confidence and it is not time-sensitive, you may answer directly. "
    "Always greet the user warmly by name if you know it."
)


def get_research_agent() -> Agent:
    """Get a research agent with the given instructions and tools."""
    # print("Using research agent")
    return get_base_agent(
        # instructions=RESEARCH_INSTRUCTIONS,
        # tools=[TavilyTools(api_key=settings.tavily_api_key, search_depth="basic", enable_search=True, max_tokens=1000)],
        tools=[WebSearchTools(enable_search=False, enable_news=False)],
        name="Research Agent",
        role="Get the latest information from the web asked by user",
    )
