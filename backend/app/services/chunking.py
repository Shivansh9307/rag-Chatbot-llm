from dataclasses import dataclass

from app.utils.tokens import decode, encode


@dataclass
class Chunk:
    text: str
    token_count: int
    page_number: int | None


def _split_paragraphs(text: str) -> list[str]:
    parts = [p.strip() for p in text.split("\n\n")]
    return [p for p in parts if p]


def chunk_text(
    text: str,
    page_number: int | None,
    chunk_size_tokens: int,
    chunk_overlap_tokens: int,
) -> list[Chunk]:
    paragraphs = _split_paragraphs(text) or [text]

    chunks: list[Chunk] = []
    current_tokens: list[int] = []

    for paragraph in paragraphs:
        paragraph_tokens = encode(paragraph)

        if len(paragraph_tokens) > chunk_size_tokens:
            if current_tokens:
                chunks.append(
                    Chunk(decode(current_tokens), len(current_tokens), page_number)
                )
                current_tokens = []
            for start in range(0, len(paragraph_tokens), chunk_size_tokens - chunk_overlap_tokens):
                piece = paragraph_tokens[start : start + chunk_size_tokens]
                chunks.append(Chunk(decode(piece), len(piece), page_number))
            continue

        if len(current_tokens) + len(paragraph_tokens) > chunk_size_tokens:
            chunks.append(Chunk(decode(current_tokens), len(current_tokens), page_number))
            overlap = current_tokens[-chunk_overlap_tokens:] if chunk_overlap_tokens else []
            current_tokens = overlap + paragraph_tokens
        else:
            current_tokens += paragraph_tokens

    if current_tokens:
        chunks.append(Chunk(decode(current_tokens), len(current_tokens), page_number))

    return chunks


def chunk_pages(
    pages: list[tuple[str, int | None]],
    chunk_size_tokens: int,
    chunk_overlap_tokens: int,
) -> list[Chunk]:
    all_chunks: list[Chunk] = []
    for text, page_number in pages:
        all_chunks.extend(
            chunk_text(text, page_number, chunk_size_tokens, chunk_overlap_tokens)
        )
    return all_chunks
