# Agno Chat — Backend

FastAPI backend for the Agno multi-agent chat application. A team router dispatches each user message to the most relevant specialist agent.

## Agents

| Agent | Tools | Role |
|---|---|---|
| **Base Agent** | — | General-purpose assistant |
| **Finance Agent** | YFinance | Stock market & financial data |
| **News Agent** | HackerNews | Latest tech news |
| **SQL Agent** | — | Natural language → SQL |

A **Team** (Groq-powered) routes incoming messages to the right agent automatically.

## Stack

- **FastAPI** — REST API
- **Agno** — agent & team orchestration
- **Groq** — LLM provider (team router + agents)
- **SQLite** — session & memory persistence (`data/tmp/agno.db`)
- **uv** — dependency management

## Prerequisites

- Python 3.13+
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- A `backend/.env` file:

```env
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```

## Run locally

```bash
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

API available at `http://localhost:8000`  
Swagger docs at `http://localhost:8000/docs`

## Run with Docker

```bash
# from the project root
docker compose up --build backend
```

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/v1/chat` | Send a message, get a response |

### Chat request/response

```json
// POST /api/v1/chat
{ "message": "What is AAPL trading at?", "user_id": "u1", "session_id": "s1" }

// Response
{ "content": "...", "session_id": "s1", "run_id": "...", "team_name": "...", "team_tools": [], "member_name": "Finance Agent", "member_tools": ["yfinance"] }
```

## File map

```
app/
  main.py          # FastAPI app, CORS, lifespan
  api/
    routes/chat.py # POST /api/v1/chat endpoint
    deps.py        # Dependency injection (team)
  agents/
    base.py        # Shared base agent factory
    finance.py     # Finance agent (YFinance)
    news.py        # News agent (HackerNews)
    sql_agent.py   # SQL agent
    team.py        # Team router
  core/
    config.py      # Pydantic settings (env vars)
    db.py          # SQLite setup
    memory.py      # Memory manager
```
