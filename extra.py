from agno.agent import Agent
from agno.db.sqlite import SqliteDb
from agno.models.groq import Groq
from agno.memory import MemoryManager
import os
from agno.tools.websearch import WebSearchTools
from dotenv import load_dotenv

load_dotenv()

db = SqliteDb(db_file="backend/data/tmp/agno.db")

memory_manager = MemoryManager(
    model=Groq(id="openai/gpt-oss-20b",api_key=os.getenv("GROQ_API_KEY")),
    db=db,
)

agent = Agent(
    model=Groq(id="openai/gpt-oss-120b",api_key=os.getenv("GROQ_API_KEY")),
    tools=[WebSearchTools()],
    instructions="You are a helpful assistant that can answer questions and help with tasks.Always greet user with a warm welcome with their name if you know it.",
    db=db,
    memory_manager=memory_manager,
    # add_history_to_context=True,
    # num_history_runs=5,
    enable_agentic_memory=True
)

# session_id = "001"
user_id = "003"
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        break
    agent.print_response(
        user_input,
        # session_id=session_id,
        user_id=user_id,
        stream=True,
    )
    # print(response)

memories = memory_manager.get_user_memories(user_id=user_id)
print("Memories:")
print(memories)
