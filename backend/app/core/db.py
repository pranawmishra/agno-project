from agno.db.sqlite import SqliteDb
from app.core.config import settings

db: SqliteDb = SqliteDb(db_file=settings.db_file)
