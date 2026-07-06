from docx import Document as DocxDocument


def extract_docx(path: str) -> list[tuple[str, int | None]]:
    doc = DocxDocument(path)
    text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    return [(text, None)]
