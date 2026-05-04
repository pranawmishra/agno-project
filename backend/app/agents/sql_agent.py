from agno.agent import Agent
from agno.tools.sql import SQLTools

from app.agents.base import get_base_agent

def get_sql_agent() -> Agent:
    """Get a SQL agent with the given instructions and tools."""
    # print("Using SQL agent")
    return get_base_agent(
        # tools=[SQLTools()],
        name="SQL Agent",
        role="Convert the user's query into a SQL query",
    )