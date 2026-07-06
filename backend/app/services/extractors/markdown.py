def extract_markdown(path: str) -> list[tuple[str, int | None]]:
    with open(path, encoding="utf-8", errors="ignore") as f:
        text = f.read()
    return [(text, None)]
