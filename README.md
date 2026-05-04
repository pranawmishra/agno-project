# Agno Chat

A multi-agent AI chat application built with [Agno](https://github.com/agno-ai/agno). A team of specialized agents routes user queries to the right expert — whether it's general questions, finance data, news, or SQL generation.

## What It Does

- **General Agent** — handles everyday questions and conversation
- **Finance Agent** — fetches stock market data via Yahoo Finance
- **News Agent** — pulls latest headlines from Hacker News
- **SQL Agent** — converts natural language into SQL queries

A team router (powered by Groq) decides which agent handles each message. Sessions and memory are persisted in SQLite.

**Stack:** FastAPI + Agno (backend) · Next.js + Tailwind CSS (frontend) · Docker Compose

---

## Prerequisites

- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- A `backend/.env` file with your API keys (see below)

### Environment Variables (`backend/.env`)

```env
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```

---

## Running with Docker (recommended)

```bash
docker compose up --build
```

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:3000    |
| Backend  | http://localhost:8000    |
| API docs | http://localhost:8000/docs |

---

## Running Locally (without Docker)

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:8000`.
