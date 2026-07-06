from app.services.extractors.docx import extract_docx
from app.services.extractors.markdown import extract_markdown
from app.services.extractors.pdf import extract_pdf
from app.services.extractors.txt import extract_txt

EXTRACTORS = {
    ".pdf": extract_pdf,
    ".txt": extract_txt,
    ".md": extract_markdown,
    ".markdown": extract_markdown,
    ".docx": extract_docx,
}


def extract(file_ext: str, path: str) -> list[tuple[str, int | None]]:
    extractor = EXTRACTORS.get(file_ext)
    if extractor is None:
        raise ValueError(f"Unsupported file extension: {file_ext}")
    return extractor(path)
