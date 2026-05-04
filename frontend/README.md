# Agno Chat — Frontend

Next.js frontend for the Agno multi-agent chat application. Messages are routed through the backend team and responses are rendered with tool/agent attribution.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**, TypeScript
- **Tailwind CSS v4**
- **Motion** — animations

## Prerequisites

- Node.js 18+
- Backend running on `http://localhost:8000` (see `../backend`)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To point at a different backend:

```bash
NEXT_PUBLIC_API_BASE=https://your-backend.example.com npm run dev
```

## Run with Docker

```bash
# from the project root
docker compose up --build frontend
```

## Backend endpoints used

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Connection status indicator |
| `POST` | `/api/v1/chat` | Submit message, receive agent response |

## File map

```
src/
  app/
    layout.tsx      # Fonts + metadata
    page.tsx        # Stateful chat page, calls API
    globals.css     # Design tokens, global styles
  components/
    Header.tsx      # App header / navigation
    Dispatch.tsx    # Renders user & assistant turns
    Composer.tsx    # Message input
    EmptyState.tsx  # Welcome / placeholder state
    Pending.tsx     # Loading state while agent responds
  lib/
    api.ts          # postChat / getHealth helpers
    desks.ts        # Maps backend agents → UI labels
    markdown.ts     # Lightweight markdown → HTML
    utils.ts        # IDs, dates, hashing utilities
```
