import pytest

from app.ai.ingestion import extract_text, split_text


def test_extracts_utf8_text():
    assert extract_text("policy.txt", "text/plain", b"Returns are accepted within 30 days.") == "Returns are accepted within 30 days."


def test_rejects_unsupported_files():
    with pytest.raises(ValueError, match="Unsupported file type"):
        extract_text("policy.exe", "application/octet-stream", b"bad")


def test_chunks_long_content_with_overlap():
    chunks = split_text("Returns policy. " * 200)
    assert len(chunks) > 1
    assert all(chunk.strip() for chunk in chunks)
