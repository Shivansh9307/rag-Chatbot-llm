# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A RAG (retrieval-augmented generation) chatbot: a FastAPI backend (`backend/`) that ingests documents into ChromaDB and streams OpenAI chat completions, plus a Next.js frontend (`frontend/`) with a macOS-style "liquid glass" UI.

## Commands

### Backend (run from `backend/`)

```bash
pip install -r requirements.txt
cp .env.example .env            # then set OPENAI_API_KEY (required — app fails to start without it)
uvicorn app.main:app --reload   # serves on http://127.0.0.1:8000
pytest                          # no test suite exists yet, but pytest is the configured runner
```

### Frontend (run from `frontend/`)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint    # eslint
```

The frontend expects the backend at `http://127.0.0.1:8000` (override with `NEXT_PUBLIC_API_BASE_URL`). Backend CORS allows `localhost:3000` by default (`CORS_ORIGINS` in `.env`).

## Architecture

### Backend data flow

Two pipelines, both configured via `app/config.py` (pydantic-settings, loaded from `.env`, cached with `@lru_cache`):

**Ingestion** — `POST /documents/upload` (`routers/documents.py`) saves the file to `data/uploads/`, creates a `Document` row with `status="processing"`, and hands off to `services/ingestion.process_document` as a FastAPI background task. That runs: extractor (`services/extractors/`, keyed by file extension: pdf/txt/md/docx) → token-based chunking (`services/chunking.py`, tiktoken counts) → OpenAI embeddings (`services/embeddings.py`) → ChromaDB (`services/vectorstore.py`, persistent client, cosine space, single `"documents"` collection). Chunk IDs are `"{document_id}:{index}"`. On completion the `Document` row flips to `ready`/`failed`; the frontend polls document status.

**Chat** — `POST /sessions/{id}/messages` (`routers/chat.py`) persists the user message, then returns a `StreamingResponse` of SSE events: `retrieve` (embed query → Chroma top-k → filter by `retrieval_min_similarity`) → `services/prompt.build_messages` (system prompt + token-budgeted history and context blocks) → `services/llm.stream_chat_completion`. Events are `{"delta": ...}` per token, then `{"done": true, "message_id", "citations"}`, or `{"error": ...}`. The assistant message (with citations JSON) is persisted only after the stream finishes.

Storage is two-part and must be kept in sync: SQLite (`data/app.db`, SQLAlchemy models in `app/models/`, tables auto-created at startup — no migrations) holds sessions/messages/document metadata, while ChromaDB (`data/chroma/`) holds vectors. Document deletion removes the Chroma vectors, the upload file, and the DB row.

### Frontend

Next.js App Router, single page (`app/page.tsx`), all client components. State lives in Zustand stores (`store/`); API calls go through `lib/api/client.ts` (`apiFetch` wrapper + `ApiError`). SSE streaming is handled in `lib/api/chat.ts` and consumed via the `useChatStream` hook, which accumulates deltas into `streamingText` in the chat store, then converts the finished stream into a regular message. Types mirroring backend schemas are in `lib/types.ts`.

Styling is Tailwind CSS v4 (via `@tailwindcss/postcss`, no tailwind.config file — theme lives in `app/globals.css`). The UI is a deliberate glassmorphism design (translucent layers, `backdrop-blur`, `VibrantWallpaper` + `LiquidToolbar`); keep new UI consistent with it.
