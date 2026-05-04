from agno.memory import MemoryManager
from agno.models.groq import Groq

from app.core.config import settings
from app.core.db import db


def get_memory_manager() -> MemoryManager:
    return MemoryManager(
        model=Groq(id=settings.memory_model_id, api_key=settings.groq_api_key),
        db=db,
    )
