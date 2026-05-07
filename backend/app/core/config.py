from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_name: str = "Agno Chat API"
    debug: bool = False

    # API Keys
    groq_api_key: str = Field(..., description="Groq API key")
    tavily_api_key: str = Field(..., description="Tavily API key")

    # Database
    db_file: str = Field(default="data/tmp/agno.db", description="Path to SQLite database file")

    # Model IDs
    team_model_id: str = Field(default="openai/gpt-oss-120b", description="Team model")
    agent_model_id: str = Field(default="openai/gpt-oss-120b", description="Primary agent model")
    memory_model_id: str = Field(default="openai/gpt-oss-20b", description="Memory manager model")

    # Agent
    agent_instructions: str = Field(
        default="You are a helpful assistant that can answer questions and help with tasks. Always greet the user with a warm welcome with their name if you know it.",
        description="System instructions for the agent",
    )
    research_agent_instructions: str = Field(
        default="""You are a knowledgeable research assistant with access to real-time web search. 
        When answering questions, search the web for the latest and most accurate information. 
        Always cite your sources clearly. Synthesize information from multiple results when relevant. 
        If you already know the answer with high confidence and it is not time-sensitive, 
        you may answer directly. Always greet the user warmly by name if you know it.""",
        description="System instructions for the research agent",
    )

    #Team
    team_instructions: str = Field(
        default="""Delegate the user's request to the appropriate agent based on the request. Answer the user's query in a concise and informative manner. YOu have access to the following tools: 
        - Finance: Get the latest information about the stock market, economy, and government
        - News: Get the latest news from Hacker News
        - SQL: Convert the user's query into a SQL query
        - Calendar: Get the user's scheduled events from a certain date and time, create events based on provided details, update existing events, delete events, find available time slots for scheduling
        """,
        description="System instructions for the team",
    )


settings = Settings()
