# AI Assistant — full-stack integration

Wires the "AI Assist" panel in your forum's `SectionComponent` up to a real
Claude-powered chat, via a small Express backend that keeps your API key
off the client.

```
ai-assistant/
├── backend/
│   ├── src/index.ts        # Express server, POST /api/chat
│   ├── .env.example        # copy to .env and fill in your key
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    └── src/
        ├── types.ts             # ChatMessage type
        └── SectionComponent.tsx # your component, AI panel wired up
```

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY (https://console.anthropic.com/settings/keys)
npm run dev
```

Runs on `http://localhost:5000`. Health check: `GET /health`.

`POST /api/chat` expects:

```json
{ "messages": [{ "role": "user", "content": "hello" }] }
```

and returns:

```json
{ "role": "assistant", "content": "Hi there!" }
```

Includes basic per-IP rate limiting (20 req/min) and request validation.
Swap `@anthropic-ai/sdk` for `openai` in `src/index.ts` if you'd rather use
OpenAI — the request/response shape the frontend expects stays the same.

## 2. Frontend

Drop `types.ts` and `SectionComponent.tsx` into your React project
(they replace your existing files of the same name). Then set where the
backend lives — either edit the `AI_API_URL` fallback in
`SectionComponent.tsx`, or (recommended) add to your frontend `.env`:

```
VITE_AI_API_URL=http://localhost:5000/api/chat
```

Then run your frontend as usual. The right-hand "AI Assist" panel now:

- keeps a running session history (`aiMessages`) sent with every request,
  so the AI has conversation memory
- shows a typing/loading indicator while waiting on the backend
- auto-scrolls to the latest message
- submits on Enter or the send button
- surfaces backend/network errors inline

## 3. Deploying

- Backend: any Node host (Render, Fly.io, Railway, an EC2 box, etc). Set
  `ANTHROPIC_API_KEY` and `CORS_ORIGIN` (your deployed frontend's origin)
  as environment variables there — never in frontend code.
- Frontend: deploy as normal (Vercel/Netlify/etc), pointing
  `VITE_AI_API_URL` at your deployed backend's `/api/chat`.
