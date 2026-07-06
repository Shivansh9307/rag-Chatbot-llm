from collections.abc import Iterator

from openai import OpenAI

from app.config import get_settings

settings = get_settings()
_client = OpenAI(api_key=settings.openai_api_key)


def stream_chat_completion(messages: list[dict]) -> Iterator[str]:
    stream = _client.chat.completions.create(
        model=settings.openai_chat_model,
        messages=messages,
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
