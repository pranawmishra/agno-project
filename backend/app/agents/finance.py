from agno.agent import Agent
from agno.tools.yfinance import YFinanceTools

from app.core.config import settings

from app.agents.base import get_base_agent

FINANCE_INSTRUCTIONS = (
    "You are a finance expert that can answer questions about finance. "
    "You have access to the following tools: "
    " - Get the latest news about the stock market"
    " - Get the latest news about the economy"
    " - Get the latest news about the government"
)

def get_finance_agent() -> Agent:
    """Get a finance agent with the given instructions and tools."""
    # print("Using finance agent")
    return get_base_agent(
        # instructions=FINANCE_INSTRUCTIONS,
        tools=[YFinanceTools()],
        name="Finance Agent",
        role="Get the latest information about the stock market, economy, and government asked by user",
    )