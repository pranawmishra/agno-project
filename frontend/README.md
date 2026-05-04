# Agno Daily — Frontend

An editorial, "newsroom after hours" interface for the Agno multi-agent
backend in `../backend`. Each backend agent (`Base Agent`, `Finance Agent`,
`News Agent`, `SQL Agent`) is presented as a "desk" of the newsroom; chat
turns are styled as filed dispatches with bylines and tool citations.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript
- Tailwind CSS v4
- Fonts: Fraunces (display), IBM Plex Sans (body), IBM Plex Mono (eyebrows)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The backend must be running on `http://localhost:8000` (the FastAPI app in
`../backend`). The frontend hits `POST /api/v1/chat` and `GET /health`.

To point at a different backend, set:

```bash
NEXT_PUBLIC_API_BASE=https://your-backend.example.com npm run dev
```

## Endpoints used

| Method | Path             | Purpose                                  |
| ------ | ---------------- | ---------------------------------------- |
| GET    | `/health`        | Wire-status indicator in the masthead.   |
| POST   | `/api/v1/chat`   | Submit a question, return a dispatch.    |

The request body is `{ message, user_id, session_id? }`; the response
yields `{ content, session_id, run_id, team_tools[], member_tools[] }`,
which the UI renders as filed prose plus "Sources cited" at the foot of
each dispatch.

## File map

```
src/
  app/
    layout.tsx        # Fonts + metadata
    page.tsx          # Stateful chat page, routes turns through the API
    globals.css       # Editorial design tokens, grain, drop-cap, prose
  components/
    Masthead.tsx      # Title block, ticker, wire-status pill
    DesksPanel.tsx    # Left rail listing the four agent "desks"
    SessionPanel.tsx  # Right rail with session stats & desk traffic
    EmptyState.tsx    # "Welcome to the wire" + wire-story exemplars
    Composer.tsx      # Letters-to-the-Editor input
    Pending.tsx       # Going-to-press loading state
    Dispatch.tsx      # User & assistant turn renderers
  lib/
    api.ts            # postChat / getHealth
    desks.ts          # Maps backend agents → newsroom desks
    markdown.ts       # Tiny no-deps markdown → HTML
    utils.ts          # IDs, dates, hashing
```
