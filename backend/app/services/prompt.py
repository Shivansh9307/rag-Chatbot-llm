from app.utils.tokens import count_tokens

SYSTEM_PROMPT = (
    "You are a helpful assistant that answers questions using the provided "
    "document excerpts as your primary source of truth. "
    "Cite sources inline like [filename, p.N] when you use information from an excerpt "
    "(omit the page number if none is given). "
    "If the excerpts don't contain enough information to answer, say so plainly instead "
    "of guessing or fabricating a citation."
)

_HISTORY_TOKEN_BUDGET = 2000
_CONTEXT_TOKEN_BUDGET = 4000


def _format_chunk(hit: dict, index: int) -> str:
    meta = hit["metadata"]
    page = meta.get("page_number")
    page_str = f", p.{page}" if page and page != -1 else ""
    return f"[Excerpt {index + 1} — {meta.get('filename')}{page_str}]\n{hit['text']}"


def build_context_block(hits: list[dict]) -> str:
    blocks: list[str] = []
    used_tokens = 0
    for i, hit in enumerate(hits):
        block = _format_chunk(hit, i)
        tokens = count_tokens(block)
        if used_tokens + tokens > _CONTEXT_TOKEN_BUDGET:
            break
        blocks.append(block)
        used_tokens += tokens
    return "\n\n".join(blocks)


def build_history_messages(history: list[dict]) -> list[dict]:
    selected: list[dict] = []
    used_tokens = 0
    for message in reversed(history):
        tokens = count_tokens(message["content"])
        if used_tokens + tokens > _HISTORY_TOKEN_BUDGET:
            break
        selected.append(message)
        used_tokens += tokens
    return list(reversed(selected))


def build_messages(question: str, hits: list[dict], history: list[dict]) -> list[dict]:
    context_block = build_context_block(hits)
    trimmed_history = build_history_messages(history)

    if context_block:
        user_content = (
            f"Document excerpts:\n{context_block}\n\n"
            f"Question: {question}"
        )
    else:
        user_content = (
            "No relevant document excerpts were found for this question.\n\n"
            f"Question: {question}"
        )

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(
        {"role": m["role"], "content": m["content"]} for m in trimmed_history
    )
    messages.append({"role": "user", "content": user_content})
    return messages


def build_citations(hits: list[dict]) -> list[dict]:
    citations = []
    for hit in hits:
        meta = hit["metadata"]
        page = meta.get("page_number")
        citations.append(
            {
                "document_id": meta.get("document_id"),
                "filename": meta.get("filename"),
                "page_number": page if page and page != -1 else None,
                "similarity": round(hit["similarity"], 4),
            }
        )
    return citations
