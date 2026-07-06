from pypdf import PdfReader


def extract_pdf(path: str) -> list[tuple[str, int | None]]:
    reader = PdfReader(path)
    pages: list[tuple[str, int | None]] = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if text.strip():
            pages.append((text, i + 1))
    return pages
